
function createVehicle(scene, pos, quat, model) {
	let modelMesh = model;

	//Going Native
	var physicsWorld = scene.getPhysicsEngine().getPhysicsPlugin().world;

	//create the ammo.js vehicle geometry to match our chassis size
	var geometry = new Ammo.btBoxShape(new Ammo.btVector3(chassisWidth * .5, chassisHeight * .5, chassisLength * .5));

	//create the transform for the vehicle 
	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(0, 0, 0));
	transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
	var motionState = new Ammo.btDefaultMotionState(transform);

	//create the local inertia of the vehicle based on its mass
	var localInertia = new Ammo.btVector3(0, 0, 0);
	geometry.calculateLocalInertia(massVehicle, localInertia);

	//create the chassis mesh
	chassisMesh = createChassisMesh(scene, chassisWidth, chassisHeight, chassisLength, modelMesh);

	//
	var massOffset = new Ammo.btVector3(0, 0.4, 0);
	var transform2 = new Ammo.btTransform();
	transform2.setIdentity();
	transform2.setOrigin(massOffset);

	//create the rigidbody to match our car chassis
	var compound = new Ammo.btCompoundShape();
	compound.addChildShape(transform2, geometry);
	var body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, compound, localInertia));
	body.setActivationState(4);

	//add our rigidbody to the physics world
	physicsWorld.addRigidBody(body);

	//setup a raycaster to control the car placement
	var tuning = new Ammo.btVehicleTuning();
	var rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
	vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster);
	vehicle.setCoordinateSystem(0, 1, 2);

	//add vehicle to the physics world
	physicsWorld.addAction(vehicle);

	//get the chassis world transform
	var trans = vehicle.getChassisWorldTransform();

	//creates one wheel with physics properties
	function addWheel(isFront, pos, radius, width, index) {
		var wheelInfo = vehicle.addWheel(
			pos,
			wheelDirectionCS0,
			wheelAxleCS,
			suspensionRestLength,
			radius,
			tuning,
			isFront);

		wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
		wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
		wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
		wheelInfo.set_m_maxSuspensionForce(600000);
		wheelInfo.set_m_frictionSlip(40);
		wheelInfo.set_m_rollInfluence(rollInfluence);

		wheelMeshes[index] = createWheelMesh(radius, width, model, index);
	}

	//add the wheels
	addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT);
	addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT);
	addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT);
	addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT);

	vehicleReady = true;
}