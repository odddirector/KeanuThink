//this function creates the car chassis and its corresponding lights including brake and reverse lights.
function createChassisMesh(scene, w, l, h, modelMeshes) {

	modelMesh = modelMeshes[0];

	//the mesh is from the getting started village tutorial 
	//base
	// const outline = [
	// 	new BABYLON.Vector3(-h/2.0, 0, -0.8),
	// 	new BABYLON.Vector3(h/2.0-0.4, 0, -0.8)
	// ]

	// //curved front
	// for (let i = 0; i < 20; i++) {
	// 	outline.push(new BABYLON.Vector3(1.6 * Math.cos(i * Math.PI / 40), 0, 1.6 * Math.sin(i * Math.PI / 40) - 0.8));
	// }

	// //top
	// outline.push(new BABYLON.Vector3(0, 0, 0.8));
	// outline.push(new BABYLON.Vector3(-h/2.0, 0, 0.8));

	//back formed automatically

	//car face UVs
	// const faceUV = [];
	// faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
	// faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
	// faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

	//car material
	const carMat = new BABYLON.StandardMaterial("carMat");
	carMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/car.png");

	//mesh = BABYLON.MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: w, faceUV: faceUV, wrap: true}); 

	for (let index = 0; index < modelMesh.getChildMeshes().length; index++) {
		let currentMesh = modelMesh.getChildMeshes()[index];
		if (currentMesh.name == "bus body") {
			mesh = currentMesh;
		}

		if (currentMesh.name.search("wheel") == -1) {
			currentMesh.position.y = currentMesh.position.y - 1;
		}
	}

	//console.log(modelMesh.getChildMeshes()[15].name);

	//mesh.material = carMat;	    

	//The default extrusion takes place in XZ plane and the car is not positioned and oriented properly
	//so we rotate the extruded mesh and then translate it to the correct position. The constant values
	//were obtained by trial and error so they might not fit for your own car mesh.

	//mesh.rotate(BABYLON.Axis.X, 3*Math.PI/2.0, BABYLON.Space.LOCAL); 
	//mesh.rotate(BABYLON.Axis.Z, -Math.PI/2.0, BABYLON.Space.LOCAL);

	mesh.rotate(BABYLON.Axis.Y, -0, BABYLON.Space.LOCAL);


	// mesh.translate(BABYLON.Axis.X, 0.25, BABYLON.Space.LOCAL);
	// mesh.translate(BABYLON.Axis.Y, 0.9, BABYLON.Space.LOCAL);				
	// mesh.translate(BABYLON.Axis.Z, 1.0, BABYLON.Space.LOCAL);

	//Because we dont want to keep reorienting and repositioning our car each frame, we bake all transforms into vertices 
	//so after this call the original vertices should be updated with the correction position and orientation.
	mesh.bakeCurrentTransformIntoVertices();



	console.log(modelMesh.getChildMeshes());

	// for (let index = 0; index < modelMesh.getChildMeshes().length; index++) {
	// 	let currentMesh = modelMesh.getChildMeshes()[index];
	// 	console.log(currentMesh.name);
	// 	if (currentMesh.name != "bus body") {
	// 		currentMesh.parent = mesh;
	// 	}
	// }

	let currentMesh = modelMesh.getChildMeshes();

	console.log("currentMesh");
	console.log(currentMesh);



	// currentMesh.forEach((modelMesh) =>
	// 	{	
	// 	if (modelMesh != mesh) {
	// 		modelMesh.parent = mesh;
	// 	}
	// 	}
	// );

	// does not parrent all mashes if inside a loop 

	//wheels
	// currentMesh[0].parent = mesh;
	// currentMesh[1].parent = mesh;
	// currentMesh[2].parent = mesh;
	// currentMesh[3].parent = mesh;


	currentMesh[4].parent = mesh;
	currentMesh[5].parent = mesh;
	currentMesh[6].parent = mesh;
	currentMesh[7].parent = mesh;
	currentMesh[8].parent = mesh;
	currentMesh[9].parent = mesh;
	currentMesh[10].parent = mesh;
	currentMesh[11].parent = mesh;
	currentMesh[12].parent = mesh;
	currentMesh[13].parent = mesh;
	
	// bus body
	//currentMesh[14].parent = mesh;

	currentMesh[15].parent = mesh;
	currentMesh[16].parent = mesh;
	currentMesh[17].parent = mesh;
	currentMesh[18].parent = mesh;
	currentMesh[19].parent = mesh;
	currentMesh[20].parent = mesh;
	currentMesh[21].parent = mesh;
	currentMesh[22].parent = mesh;
	currentMesh[23].parent = mesh;
	currentMesh[24].parent = mesh;
	currentMesh[25].parent = mesh;
	currentMesh[26].parent = mesh;
	currentMesh[27].parent = mesh;
	currentMesh[28].parent = mesh;
	currentMesh[29].parent = mesh;
	currentMesh[30].parent = mesh;
	currentMesh[31].parent = mesh;

	
	// currentMesh[4].parent = mesh;
	// currentMesh[5].parent = mesh;
	// currentMesh[6].parent = mesh;
	// currentMesh[7].parent = mesh;
	// currentMesh[8].parent = mesh;
	// currentMesh[9].parent = mesh;
	// currentMesh[10].parent = mesh;
	// currentMesh[11].parent = mesh;
	// currentMesh[12].parent = mesh;
	// currentMesh[13].parent = mesh;
	// currentMesh[14].parent = mesh;


	// modelMeshes.forEach((currentMesh) =>
	// 	{	
	// 	if (currentMesh.name != "bus body") {
	// 		currentMesh.parent = mesh;
	// 	}
	// 	}
	// );



	//create the left brake light
	var brakeLightL = BABYLON.MeshBuilder.CreateBox("Brake Light L", { width: 0.3, height: 0.1, depth: 0.05 });

	//lets create a darkish red colored brake light material to show an off brake light
	brakeLightMaterial = new BABYLON.StandardMaterial("brakeLight");
	brakeLightMaterial.diffuseColor = new BABYLON.Color3(0.75, 0, 0);

	//assign the material to the brakelight left mesh
	brakeLightL.material = brakeLightMaterial;

	//position the left brakelight mesh
	brakeLightL.position.x = -0.4;
	brakeLightL.position.y = 0.375;
	brakeLightL.position.z = -1.75;

	//link the left brakelight mesh to the chassis
	brakeLightL.parent = mesh;

	//create the right brake light
	var brakeLightR = brakeLightL.createInstance("Brake Light R");

	//position the right brakelight mesh
	brakeLightR.position.x = 0.4;
	brakeLightR.position.y = 0.375;
	brakeLightR.position.z = -1.75;

	//link the right brakelight mesh to the chassis
	brakeLightR.parent = mesh;

	//create left reverse light
	var reverseLightL = BABYLON.MeshBuilder.CreateBox("Reverse Light L", { width: 0.1, height: 0.1, depth: 0.05 });

	//position the left reverse light mesh
	reverseLightL.position.x = -0.2;
	reverseLightL.position.y = 0.375;
	reverseLightL.position.z = -1.75;

	//lets create a darkish yellow colored reverse light material to show an off reverse light
	reverseLightMaterial = new BABYLON.StandardMaterial("reverseLight");
	reverseLightMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0.5);

	//assign the material to the left reverse light mesh
	reverseLightL.material = reverseLightMaterial;

	//link the left reverse light to the chassis
	reverseLightL.parent = mesh;

	//create right reverse light
	var reverseLightR = reverseLightL.createInstance("Reverse Light R");

	//position the right reverse light mesh
	reverseLightR.position.x = 0.2;
	reverseLightR.position.y = 0.375;
	reverseLightR.position.z = -1.75;

	//link the right reverse light to the chassis
	reverseLightR.parent = mesh;

	//create the indicator light material
	var indicatorLightMaterialL = new BABYLON.StandardMaterial("indicatorLight");
	var indicatorLightMaterialR = new BABYLON.StandardMaterial("indicatorLight");
	indicatorLightMaterialL.diffuseColor = new BABYLON.Color3(1, 0.6, 0);
	indicatorLightMaterialR.diffuseColor = new BABYLON.Color3(1, 0.6, 0);

	//create left indicator light
	indicatorLightL = BABYLON.MeshBuilder.CreateCylinder("Indicator Light L", { diameterTop: 0, diameterBottom: 0.1, height: 0.1 });
	//CreateCone("Indicator Light L", {width:0.1, height: 0.1, depth: 0.05}); 

	//assign indicator material
	indicatorLightL.material = indicatorLightMaterialL;

	//position the left indicator light mesh
	indicatorLightL.position.x = -0.6;
	indicatorLightL.position.y = 0.375;
	indicatorLightL.position.z = -1.75;

	//link the left indicator light to the chassis
	indicatorLightL.parent = mesh;

	//create right indicator light
	indicatorLightR = indicatorLightL.clone("Indicator Light R");

	//assign indicator material
	indicatorLightR.material = indicatorLightMaterialR;

	indicatorLightL.rotate(BABYLON.Axis.Z, Math.PI / 2.0, BABYLON.Space.LOCAL);

	//position the right indicator light mesh
	indicatorLightR.position.x = 0.6;
	indicatorLightR.position.y = 0.375;
	indicatorLightR.position.z = -1.75;

	indicatorLightR.rotate(BABYLON.Axis.Z, -Math.PI / 2.0, BABYLON.Space.LOCAL);

	//link the right indicator light to the chassis
	indicatorLightR.parent = mesh;


	//we create a car follow camera to keep following our car.
	var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, 10));
	camera.radius = 10;
	camera.heightOffset = 4;
	camera.rotationOffset = 180; //this value rotates the follow camera. To get a side on view set this value to -90 or 90
	camera.cameraAcceleration = 0.05;
	camera.maxCameraSpeed = 400;
	camera.attachControl(canvas, true);
	camera.lockedTarget = mesh; //version 2.5 onwards

	//make this as the active scene camera
	scene.activeCamera = camera;

	//debug view of axes
	/*const axes = new BABYLON.AxesViewer(scene, 2);
	axes.xAxis.parent = mesh;
	axes.yAxis.parent = mesh;
	axes.zAxis.parent = mesh;*/

	return mesh;
}