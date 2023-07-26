var chassisWidth = 1.4;
var chassisHeight = 1.8;
var chassisLength = 7.3;
var massVehicle = 200;

var wheelAxisPositionBack = -2.11;
var wheelRadiusBack = .4;
var wheelWidthBack = .3;
var wheelHalfTrackBack = 0.6;
var wheelAxisHeightBack = 0.4;

var wheelAxisFrontPosition = 2.63;
var wheelHalfTrackFront = 0.6;
var wheelAxisHeightFront = 0.4;
var wheelRadiusFront = .4;
var wheelWidthFront = .3;

var friction = 5;
var suspensionStiffness = 10;
var suspensionDamping = 0.3;
var suspensionCompression = 4.4;
var suspensionRestLength = 0.6;
var rollInfluence = 0.0;

var steeringIncrement = .02;
var steeringClamp = 0.4;
var maxEngineForce = 500;
var maxBreakingForce = 10;
var incEngine = 10.0;

var FRONT_LEFT = 0;
var FRONT_RIGHT = 1;
var BACK_LEFT = 2;
var BACK_RIGHT = 3;

var wheelDirectionCS0;
var wheelAxleCS;

var engineForce = 0;
var vehicleSteering = 0;
var breakingForce = 0;