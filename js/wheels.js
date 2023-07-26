//this function creates the wheel mesh based on the getting started village tutorial
function createWheelMesh(radius, width, modelMesh, index) {

	console.log(modelMesh[0].getChildMeshes()[index]);

	//create our wheel mesh using a cylinder
	//var mesh = new BABYLON.MeshBuilder.CreateCylinder("Wheel", {diameter:1, height:0.5,  faceUV: wheelUV});// tessellation: 6});

	let mesh;
	let allWheels = modelMesh[0].getChildMeshes();

	switch (index) {
		case 0:
			mesh = allWheels[2];
			break;
		case 1:
			mesh = allWheels[0];
			break;
		case 2:
			mesh = allWheels[1];
			break;
		case 3:
			mesh = allWheels[3];
			break;
	}

	mesh.rotationQuaternion = new BABYLON.Quaternion();

	//assign the wheel material which is created in createScene function on initialization
	//mesh.material = wheelMaterial;

	//cylinder is oriented in XZ plane, we want our wheels to be oriented in XY plane
	mesh.rotate(BABYLON.Axis.Y, Math.PI / 2);

	//in order to prevent doing this tranformation every frame, we bake the transform into vertices
	mesh.bakeCurrentTransformIntoVertices();

	return mesh;
}