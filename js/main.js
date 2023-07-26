
var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
	engine.runRenderLoop(function () {
		if (sceneToRender && sceneToRender.activeCamera) {
			sceneToRender.render();
		}
	});
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var vehicle, chassisMesh, redMaterial, blueMaterial, greenMaterial, wheelMaterial, brakeLightMaterial, reverseLightMaterial, indicatorLightL, indicatorLightR;
var wheelMeshes = [];
const wheelUV = [];
var actions = { accelerate: false, brake: false, right: false, left: false };

var keysActions = {
	"KeyW": 'acceleration',
	"KeyS": 'braking',
	"KeyD": 'left',
	"KeyA": 'right'
};

var vehicleReady = false;

var ZERO_QUATERNION = new BABYLON.Quaternion();

//Please refer to the ammo.js vehicle documentation to know more about these values.
//https://rawcdn.githack.com/kripken/ammo.js/99d0ec0b1e26d7ccc13e013caba8e8a5c98d953b/examples/webgl_demo_vehicle/index.html

//This demo is based on this PG: https://playground.babylonjs.com/#609QKP#2


