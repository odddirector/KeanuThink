
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
const createScene = async function () {
	// This creates a basic Babylon Scene object (non-mesh)
	const scene = new BABYLON.Scene(engine);
	scene.useRightHandedSystem = true;

	// This creates and positions a free camera (non-mesh)
	const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

	// This targets the camera to scene origin
	camera.setTarget(BABYLON.Vector3.Zero());

	// This attaches the camera to the canvas
	camera.attachControl(canvas, true);

	// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
	const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

	// Default intensity is 1. Let's dim the light a small amount
	light.intensity = 0.7;

	// Our built-in 'sphere' shape.
	const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

	const sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

	// Move the sphere upward at 4 units
	sphere.position.y = 4;
	sphere2.position.y = 6;
	sphere2.position.x = 4;

	// Our built-in 'ground' shape.
	const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);


	// initialize plugin
	const havokInstance = await HavokPhysics();
	// pass the engine to the plugin
	const hk = new BABYLON.HavokPlugin(true, havokInstance);
	// enable physics in the scene with a gravity
	scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk);

	// let [snowMan, sign, snowField, snowBall] = await Promise.all([
	//     BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/Demos/Snow_Man_Scene/", "snowMan.glb", scene),
	//     BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/Demos/Snow_Man_Scene/", "sign.glb", scene),
	//     BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/Demos/Snow_Man_Scene/", "snowField.glb", scene),
	//     BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/Demos/Snow_Man_Scene/", "snowBall.glb", scene)
	// ]);

	// let [sandra] = await Promise.all([
	//     BABYLON.SceneLoader.ImportMeshAsync("", "../assets/models/", "sandra_2.glb", scene)
	// ]);

	// sandra = snowMan.meshes[0];
    // sandra.name = "Sandra";

	// BABYLON.SceneLoader.Append("../assets/models/", "sandra_2.glb", scene, function (scene) {
	// 	// do something with the scene
	// });

	BABYLON.SceneLoader.ImportMesh("", "../assets/models//", "sandra_2.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
        var sandra = newMeshes[0];

		sandra.position.y = 4;
		sandra.position.z = -5.4;

        // //Lock camera on the character 
        // camera1.target = hero;

		const sandraAggregate = new BABYLON.PhysicsAggregate(sandra, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution:  0.75 }, scene);
    });


	// Create a sphere shape and the associated body. Size will be determined automatically.
	const sphereAggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);
	const sphere2Aggregate = new BABYLON.PhysicsAggregate(sphere2, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);

	// Create a static box shape.
	const groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);

	scene.debugLayer.show();

	return scene;
};

createScene().then((scene) => {
	engine.runRenderLoop(function () {
		if (scene) {
			scene.render();
		}
	});
});
// Resize
window.addEventListener("resize", function () {
	engine.resize();
});
