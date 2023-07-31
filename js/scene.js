var createScene = async function () {

	
	let bombEngaged = false;
	let speedometer = document.querySelector("#speed");

	let allCarsLoaded = false; 

	// Setup basic scene
	var scene = new BABYLON.Scene(engine);
	scene.useRightHandedSystem = true;
	//scene.debugLayer.show();

	//we create our car follow camera in createChassisMesh function
	//var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10));
	//camera.setTarget(BABYLON.Vector3.Zero());
	//camera.attachControl(canvas, true);

	//create our light
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0));
	light.intensity = 1;
	scene.clearColor = new BABYLON.Color3(0.6, 0.8, 1);

	//we store the wheel face UVs once and reuse for each wheel		
	wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
	wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
	wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

	// Enable physics
	await Ammo();
	scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.AmmoJSPlugin());

	//this is the direction of motion of wheels
	wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);

	//this is the direction of wheel axle
	wheelAxleCS = new Ammo.btVector3(-1, 0, 0);


	var material = new BABYLON.StandardMaterial(scene);
	material.alpha = 1;
	material.diffuseColor = new BABYLON.Color3(1, 0.856233, 0.800358);	
	

	//create our ground floor
	var ground = BABYLON.Mesh.CreateGround("ground", 460, 460, 2);
	console.log("ground");
	console.log(ground);
	ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 });
	
	ground.material = material;
	//const roadMaterial = new BABYLON.StandardMaterial("roadMaterial", scene);
	// roadMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/road_texture_2.png", scene);
	// roadMaterial.diffuseTexture.uScale = 0.6;
	// roadMaterial.diffuseTexture.vScale = 0.6;
	// console.log(roadMaterial.diffuseTexture);
	// roadMaterial.uOffset = -roadMaterial.uScale*.5;
	// roadMaterial.vOffset = -roadMaterial.vScale*.5;
	//ground.material = roadMaterial;

	

	let groundTwo = BABYLON.Mesh.CreateGround("ground", 460, 460, 2);
	groundTwo.physicsImpostor = new BABYLON.PhysicsImpostor(groundTwo, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 });
	groundTwo.position.z = 460;

	groundTwo.material = material;

	//import the bus model 
	BABYLON.SceneLoader.ImportMesh("", "assets/models/", "bus_textured_2.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
		createVehicle(scene, new BABYLON.Vector3(0, 4, -20), ZERO_QUATERNION, newMeshes);
	});


	let cloneCarInitialPosition = {
		x: 2.5,
		y: 0,
		z: 0
	};
	let cars = [];
	let numberOfCars = 9;
	let carIterator = 0;
	let distanceBetweenCars = 20;
	let lastCarPosition;

	for (let index = 0; index < numberOfCars; index++) {
		BABYLON.SceneLoader.ImportMesh("", "assets/models/cars/", index+".glb", scene, function (carMeshes, particleSystems, skeletons, animationGroups) {
			cars[index] = carMeshes[0].getChildMeshes()[0];

			cars[index].parent = null;

			cars[index].position.x = cloneCarInitialPosition.x;
			cars[index].position.z = cloneCarInitialPosition.z + (distanceBetweenCars * index);
			
			lastCarPosition = distanceBetweenCars * index;

			cars[index].physicsImpostor = new BABYLON.PhysicsImpostor(cars[index], BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0.1, friction: 1, restitution: 0.7 });
			
			if(index == numberOfCars-1) {
				// a hack to prevent a physicsImpostor undefined error inside the render  
				setTimeout(() => {
					allCarsLoaded = true;
				}, 1000);
			}
		});
		
	}


	let loadedCityMeshes;
	let loadedCityOriginalPositions = {};

	//import the city 

	BABYLON.SceneLoader.ImportMesh("", "assets/models/", "city_pre_6.glb", scene, function (cityMeshes) {

		loadedCityMeshes = cityMeshes;

		cityMeshes[0].getChildMeshes().forEach(function (mesh) {


			let mass = 0.5;

			if (mesh.name.search("bridge") != -1) {
				mass = 0;
			}

			loadedCityOriginalPositions[mesh.id] = {
				position: {
					x: mesh.position.x,
					y: mesh.position.y,
					z: mesh.position.z
				},
				rotationQuaternion: {
					x: mesh.rotationQuaternion.x,
					y: mesh.rotationQuaternion.y,
					z: mesh.rotationQuaternion.z,
					w: mesh.rotationQuaternion.w
				}
			};


			mesh.parent = null;

			if (mesh.name.search("ground") == -1 && mesh.name.search("bridge") == -1) {
				mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.MeshImpostor, { mass: mass, friction: 1, restitution: 0.7 });
			}
			if (mesh.name.search("bridge") != -1) {
				mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 1, restitution: 0.7 });
				mesh.position.z = 200;
				mesh.dispose(); //temporarily disable the bridge
			}

			for (let index = 1; index < 3; index++) {
				if (mesh.name.search("bridge") != -1) {
					continue;
				}
				var newInstance = mesh.createInstance("i" + index);
				// Here you could change the properties of your individual instance,
				// for example to form a diagonal line of instances:
				//  newInstance.position.x = index;
				 newInstance.position.z = mesh.position.z + (35 * index);

				 if (mesh.name.search("ground") == -1) {
				 	newInstance.physicsImpostor = new BABYLON.PhysicsImpostor(newInstance, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0.5, friction: 1, restitution: 0.7 });
				 }
				// See below for more details on what can be changed.
			}

		});

	});

	var time = 0;
	let theBusIsHalfWaydispatchedOnce = false;
	let repositionIncrement = 70;
	let repositionCounter = -2;

	function repositionCity(meshes, busPoZition) {

		

		//console.log("==================== reposition the city");
		//console.log(meshes);

		//console.log("loadedCityOriginalPositions");
		//console.log(loadedCityOriginalPositions);

		repositionCounter++;

		if(repositionCounter >= 2) {
			repositionCounter = -1;
		}

		//console.log("repositionCounter = "+repositionCounter);
		
		//console.log(repositionCounter);

	
		meshes.forEach(function (mesh) {
			// console.log(mesh.PhysicsImpostor);
			// console.log("mesh.rotation");

			//console.log(mesh);
			// reset positions and rotatins f-up after collisions
			if (loadedCityOriginalPositions[mesh.id] != undefined) {
				
		

					// reposition the city mesh itself 
					//console.log("repositionCounter = "+ repositionCounter);

					if (repositionCounter == -1) {

						mesh.position.x = loadedCityOriginalPositions[mesh.id].position.x;
						mesh.position.y = loadedCityOriginalPositions[mesh.id].position.y;
						mesh.position.z = loadedCityOriginalPositions[mesh.id].position.z + (busPoZition + repositionIncrement);

						mesh.rotationQuaternion.x = loadedCityOriginalPositions[mesh.id].rotationQuaternion.x;
						mesh.rotationQuaternion.y = loadedCityOriginalPositions[mesh.id].rotationQuaternion.y;
						mesh.rotationQuaternion.z = loadedCityOriginalPositions[mesh.id].rotationQuaternion.z;
						mesh.rotationQuaternion.w = loadedCityOriginalPositions[mesh.id].rotationQuaternion.w;

					}
				  

		

					// reposition the city mesh instances 

					if (repositionCounter > -1) {
						//for (let index = 0; index < mesh.instances.length; index++) {

							if (mesh.instances.length != 0) {

								//console.log("mesh.instances");
								//console.log(mesh.instances);

								//console.log("repositionCounter = "+repositionCounter);

								// let instance;
								// if (repositionCounter == 2) {
								// 	instance = mesh.instances[0];
								// }
								// if (repositionCounter == 3) {
								// 	instance = mesh.instances[1];
								// }

								
								let instance = mesh.instances[repositionCounter];

								instance.position.x = loadedCityOriginalPositions[mesh.id].position.x;
								instance.position.y = loadedCityOriginalPositions[mesh.id].position.y;
								instance.position.z = loadedCityOriginalPositions[mesh.id].position.z + (busPoZition + repositionIncrement);

								instance.rotationQuaternion.x = loadedCityOriginalPositions[mesh.id].rotationQuaternion.x;
								instance.rotationQuaternion.y = loadedCityOriginalPositions[mesh.id].rotationQuaternion.y;
								instance.rotationQuaternion.z = loadedCityOriginalPositions[mesh.id].rotationQuaternion.z;
								instance.rotationQuaternion.w = loadedCityOriginalPositions[mesh.id].rotationQuaternion.w;
							}
							
						//}
					}
				
				
				
			}

			// move all the buildings forward 
			//mesh.position.z = busPoZition + repositionIncrement;

			
		});



		//console.log("done repositioning");
		

	}


	function badaBoom() {
		console.log("BOOM!");
		//console.log(chassisMesh.position);

		// explode the bus
		var radius = 20;
		var strength = 10;
		var physicsHelper = new BABYLON.PhysicsHelper(scene);

		console.log("applyRadialExplosionImpulse");

		BABYLON.ParticleHelper.CreateAsync("explosion", scene).then((set) => {
			
			console.log(set);

			//flash
			// set.systems[0].maxSize = 0.2;

			// //shockwave
			// set.systems[1].maxSize = 0.4;

			// // fireball
			// set.systems[2].maxSize = 0.3;

			// // debris
			// set.systems[3].maxSize = 0.05;

			for (let index = 0; index < set.systems.length; index++) {
				set.systems[index].emitter = new BABYLON.Vector3(chassisMesh.position.x, chassisMesh.position.y, chassisMesh.position.z);
			}

			set.systems.forEach(s => {
				s.disposeOnStop = true;
			});
			set.start();
		});

		setTimeout(() => {
			physicsHelper.applyRadialExplosionImpulse( // or .applyRadialExplosionForce
				new BABYLON.Vector3(chassisMesh.position.x, chassisMesh.position.y, chassisMesh.position.z),
				radius,
				strength,
				BABYLON.PhysicsRadialImpulseFalloff.Linear // or BABYLON.PhysicsRadialImpulseFalloff.Constant
			);
		}, 500);

	}

	//register prerender callback to initiate 
	scene.registerBeforeRender(function () {

		//time step delta (dt)
		var dt = engine.getDeltaTime().toFixed() / 1000;
		time += dt;
		var val = Math.round(Math.abs(Math.sin(time * 5)));

		if (vehicleReady) {
			//get the cars current speed from ammo.js
			var speed = vehicle.getCurrentSpeedKmHour();
			
			//console.log(parseInt(speed)+ " km/h");
			speedometer.innerHTML = parseInt(speed)+ " km/h";

			var maxSteerVal = 0.2;
			breakingForce = 0;
			engineForce = 0;

			//console.log(speed);

			if (speed > 50) {
				//engage the bomb
				bombEngaged = true; 
			}

			if (bombEngaged && speed < 50) {
				badaBoom();
				bombEngaged = false;
			}

			//see if we are accelerating
			if (actions.acceleration) {
				//are we decreasing or  increasing
				if (speed < -1) {
					breakingForce = maxBreakingForce;
				} else {
					engineForce = maxEngineForce;
				}

			} else if (actions.braking) {
				//are we decreasing or increasing to signify we want to go reverse
				if (speed > 1) {
					breakingForce = maxBreakingForce;
				} else {
					engineForce = -maxEngineForce;
				}
			}

			//are we turning right
			if (actions.right) {
				//turn the right indicator on
				indicatorLightR.material.emissiveColor.r = val;
				indicatorLightR.material.emissiveColor.g = val * 0.1;
				indicatorLightR.material.emissiveColor.b = 0;

				if (vehicleSteering < steeringClamp) {
					vehicleSteering += steeringIncrement;
				}

			}
			//are we turning left
			else if (actions.left) {
				//turn the left indicator on
				indicatorLightL.material.emissiveColor.r = val;
				indicatorLightL.material.emissiveColor.g = val * 0.1;
				indicatorLightL.material.emissiveColor.b = 0.0;

				if (vehicleSteering > -steeringClamp) {
					vehicleSteering -= steeringIncrement;
				}

			} else {
				vehicleSteering *= 0.95; //this dampens the return of the wheel when the user releases the key

				//close our left indicator
				indicatorLightL.material.emissiveColor.r = 0;
				indicatorLightL.material.emissiveColor.g = 0;
				indicatorLightL.material.emissiveColor.b = 0;

				//close our right indicator
				indicatorLightR.material.emissiveColor.r = 0;
				indicatorLightR.material.emissiveColor.g = 0;
				indicatorLightR.material.emissiveColor.b = 0;
			}

			//apply forces on the vehicle
			vehicle.applyEngineForce(engineForce, FRONT_LEFT);
			vehicle.applyEngineForce(engineForce, FRONT_RIGHT);

			//apply break on the vehicle with unequal amount of force for front and rear wheels				
			vehicle.setBrake(breakingForce / 2, FRONT_LEFT);
			vehicle.setBrake(breakingForce / 2, FRONT_RIGHT);
			vehicle.setBrake(breakingForce, BACK_LEFT);
			vehicle.setBrake(breakingForce, BACK_RIGHT);

			//lets handle break light turning on or off
			//if the breaking force is >0 we are turning the light on
			if (breakingForce > 0) {
				brakeLightMaterial.emissiveColor.r = 1;
			}
			else {
				//else  we turn the brake light off
				brakeLightMaterial.emissiveColor.r = 0;
			}

			//lets handle reverse light turning on or off
			//if the engine force is <0, we are reversing so we turn the light on
			if (engineForce < 0) {
				reverseLightMaterial.emissiveColor.r = 1;
				reverseLightMaterial.emissiveColor.g = 1;
				reverseLightMaterial.emissiveColor.b = 0.5;
			}
			else {
				//else we turn the reverse light off
				reverseLightMaterial.emissiveColor.r = 0;
				reverseLightMaterial.emissiveColor.g = 0;
				reverseLightMaterial.emissiveColor.b = 0;
			}

			//apply the steering value
			vehicle.setSteeringValue(vehicleSteering, FRONT_LEFT);
			vehicle.setSteeringValue(vehicleSteering, FRONT_RIGHT);

			//once we have applied all forces to ammo.js vehicle, we need to update the 
			//position and orientation of our car chassis and wheel.  				
			var tm, p, q, i;
			var n = vehicle.getNumWheels();

			//get the updated position and orientation of each wheel
			for (i = 0; i < n; i++) {
				vehicle.updateWheelTransform(i, true);
				tm = vehicle.getWheelTransformWS(i);
				p = tm.getOrigin();
				q = tm.getRotation();
				wheelMeshes[i].position.set(p.x(), p.y(), p.z());
				wheelMeshes[i].rotationQuaternion.set(q.x(), q.y(), q.z(), q.w());

			}

			//get the updated position and orientation of our car chassis
			tm = vehicle.getChassisWorldTransform();
			p = tm.getOrigin();
			q = tm.getRotation();
			chassisMesh.position.set(p.x(), p.y(), p.z());
			chassisMesh.rotationQuaternion.set(q.x(), q.y(), q.z(), q.w());

			let positionInt = parseInt(chassisMesh.position.z);
			let cityRepositionFrequency = 50;

			if(positionInt > 5) {
				if (positionInt % 35 == 0 && theBusIsHalfWaydispatchedOnce == false) {
					theBusIsHalfWaydispatchedOnce = true;
					//console.log("reposition city");
					repositionCity(loadedCityMeshes, positionInt);
				}
				if (positionInt % 36 == 0) {
					theBusIsHalfWaydispatchedOnce = false;
				}
			}


			// ----------- infinite ground planes 
			let threshold = 50;
			// once you cross the ground plane edge, move it after the groundTwo plane 
			if (chassisMesh.position.z >= ground.position.z + ground.getBoundingInfo().boundingBox.maximum.z + threshold) {
				ground.position.z += (ground.getBoundingInfo().boundingBox.maximum.z * 4);
			}
			// onc you cross the groundTwo plane, move it right after the ground plane 
			if (chassisMesh.position.z >= groundTwo.position.z + groundTwo.getBoundingInfo().boundingBox.maximum.z + threshold) {
				groundTwo.position.z += (groundTwo.getBoundingInfo().boundingBox.maximum.z * 4);
			}
			

			if(carIterator >= numberOfCars-1) {
				carIterator = 0;
			} else {
				carIterator++;
			}

			//Force Settings
			var forceDirection = new BABYLON.Vector3(0, 0, -5);
			var forceMagnitude = -2;
			var contactLocalRefPoint = BABYLON.Vector3.Zero();

			// does not work in a loop
			if (allCarsLoaded) {
				cars[0].physicsImpostor.setLinearVelocity(forceDirection);
				cars[1].physicsImpostor.setLinearVelocity(forceDirection);
				cars[2].physicsImpostor.setLinearVelocity(forceDirection);
				cars[3].physicsImpostor.setLinearVelocity(forceDirection);
				cars[4].physicsImpostor.setLinearVelocity(forceDirection);
				cars[5].physicsImpostor.setLinearVelocity(forceDirection);
				cars[6].physicsImpostor.setLinearVelocity(forceDirection);
				cars[7].physicsImpostor.setLinearVelocity(forceDirection);
			

				if(cars[carIterator].position.z < chassisMesh.position.z - 10) {
					cars[carIterator].position.z = lastCarPosition + chassisMesh.position.z;
				}
			}

		}
	});

	return scene;
};