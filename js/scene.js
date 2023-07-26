var createScene = async function () {
	// Setup basic scene
	var scene = new BABYLON.Scene(engine);
	scene.useRightHandedSystem = true;
	scene.debugLayer.show();

	//we create our car follow camera in createChassisMesh function
	//var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10));
	//camera.setTarget(BABYLON.Vector3.Zero());
	//camera.attachControl(canvas, true);

	//create our light
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0));
	light.intensity = 0.7;

	//we create some materials for our obstacles
	redMaterial = new BABYLON.StandardMaterial("RedMaterial");
	redMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.5);
	redMaterial.emissiveColor = new BABYLON.Color3(0.8, 0.4, 0.5);

	blueMaterial = new BABYLON.StandardMaterial("RedMaterial");
	blueMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.4, 0.8);
	blueMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.4, 0.8);

	greenMaterial = new BABYLON.StandardMaterial("RedMaterial");
	greenMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.8, 0.5);
	greenMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.8, 0.5);

	//load our wheel material
	wheelMaterial = new BABYLON.StandardMaterial("WheelMaterial");
	wheelMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png");

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

	//create our ground floor
	var ground = BABYLON.Mesh.CreateGround("ground", 460, 460, 2);
	ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 });
	ground.material = new BABYLON.GridMaterial("groundMaterial");

	//create obstacles
	createObstacle(new BABYLON.Vector3(4, 1, 12), new BABYLON.Vector3(0, 0, 25), new BABYLON.Vector3(-Math.PI / 8, 0, 0), 0);
	createObstacle(new BABYLON.Vector3(4, 1, 12), new BABYLON.Vector3(25, 0, 0), new BABYLON.Vector3(-Math.PI / 8, Math.PI / 2, 0), 0);
	createObstacle(new BABYLON.Vector3(4, 1, 12), new BABYLON.Vector3(0, 0, -25), new BABYLON.Vector3(Math.PI / 8, 0, 0), 0);
	createObstacle(new BABYLON.Vector3(4, 1, 12), new BABYLON.Vector3(-25, 0, 0), new BABYLON.Vector3(Math.PI / 8, Math.PI / 2, 0), 0);

	//we randomize the creation of obstacles by making boxes of arbitrary size and orientation
	let s = new BABYLON.Vector3();
	let p = new BABYLON.Vector3();
	let r = new BABYLON.Vector3();
	for (let i = 0; i < 20; i++) {
		let m = Math.random() * 300 - 150 + 5;
		let m3 = Math.random() * 300 - 150 + 5;
		let m2 = Math.random() * 10;
		s.set(m2, m2, m2);
		p.set(m3, 0, m);
		r.set(m, m, m);
		createObstacle(s, p, r, 0);
	}

	//we randomize some more obstacles by making boxes of arbitrary size and orientation
	for (let i = 0; i < 30; i++) {
		let m = Math.random() * 300 - 150 + 5;
		let m3 = Math.random() * 300 - 150 + 5;
		let m2 = Math.random() * 3;
		s.set(m2, m2, m2);
		p.set(m3, 0, m);
		r.set(m, m, m);
		createObstacle(s, p, r, 5);
	}

	//load the pink spiral ramp mesh
	loadTriangleMesh(scene);

	//create our car
	BABYLON.SceneLoader.ImportMesh("", "assets/models/", "bus_11.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
		createVehicle(scene, new BABYLON.Vector3(0, 4, -20), ZERO_QUATERNION, newMeshes);
	});


	var time = 0;

	//register prerender callback to initiate 
	scene.registerBeforeRender(function () {

		//time step delta (dt)
		var dt = engine.getDeltaTime().toFixed() / 1000;
		time += dt;
		var val = Math.round(Math.abs(Math.sin(time * 5)));

		if (vehicleReady) {
			//get the cars current speed from ammo.js
			var speed = vehicle.getCurrentSpeedKmHour();
			var maxSteerVal = 0.2;
			breakingForce = 0;
			engineForce = 0;

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
		}
	});

	return scene;
};


function loadTriangleMesh(scene) {
	var physicsWorld = scene.getPhysicsEngine().getPhysicsPlugin().world;
	BABYLON.SceneLoader.ImportMesh("Loft001", "https://raw.githubusercontent.com/RaggarDK/Baby/baby/", "ramp.babylon", scene, function (newMeshes) {
		for (let x = 0; x < newMeshes.length; x++) {
			let mesh = newMeshes[x];
			mesh.position.y -= 2.5;
			mesh.material = redMaterial;
			let positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
			let normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
			let colors = mesh.getVerticesData(BABYLON.VertexBuffer.ColorKind);
			let uvs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind);
			let indices = mesh.getIndices();

			mesh.updateFacetData();
			var localPositions = mesh.getFacetLocalPositions();
			var triangleCount = localPositions.length;

			let mTriMesh = new Ammo.btTriangleMesh();
			let removeDuplicateVertices = true;
			let tmpPos1 = new Ammo.btVector3(0, 0, 0);
			let tmpPos2 = new Ammo.btVector3(0, 0, 0);
			let tmpPos3 = new Ammo.btVector3(0, 0, 0);

			var _g = 0;
			while (_g < triangleCount) {
				var i = _g++;
				var index0 = indices[i * 3];
				var index1 = indices[i * 3 + 1];
				var index2 = indices[i * 3 + 2];
				var vertex0 = new Ammo.btVector3(positions[index0 * 3], positions[index0 * 3 + 1], positions[index0 * 3 + 2]);
				var vertex1 = new Ammo.btVector3(positions[index1 * 3], positions[index1 * 3 + 1], positions[index1 * 3 + 2]);
				var vertex2 = new Ammo.btVector3(positions[index2 * 3], positions[index2 * 3 + 1], positions[index2 * 3 + 2]);
				mTriMesh.addTriangle(vertex0, vertex1, vertex2);
			}

			let shape = new Ammo.btBvhTriangleMeshShape(mTriMesh, true, true);
			let localInertia = new Ammo.btVector3(0, 0, 0);
			let transform = new Ammo.btTransform;

			transform.setIdentity();
			transform.setOrigin(new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z));
			transform.setRotation(new Ammo.btQuaternion(
				mesh.rotationQuaternion.x, mesh.rotationQuaternion.y, mesh.rotationQuaternion.z, mesh.rotationQuaternion.w));

			let motionState = new Ammo.btDefaultMotionState(transform);
			let rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, shape, localInertia);
			let body = new Ammo.btRigidBody(rbInfo);
			physicsWorld.addRigidBody(body);
		}
	});
}