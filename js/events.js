//key up event handler
function keyup(e) {
    if(document.querySelector("body").classList.contains("play")) {
        if (keysActions[e.code]) {
            actions[keysActions[e.code]] = false;
        }
    }
}

// console.log("events.js");

//decelerate naturally
setInterval(() => {
    if(document.querySelector("body").classList.contains("play") == false) {
        actions.acceleration = false;
    }
}, 500);

//key down event handler
function keydown(e) {
    //console.log(e.code);

    if(document.querySelector("body").classList.contains("play")) {
        if (keysActions[e.code]) {
            actions[keysActions[e.code]] = true;
        }
    } else {
        if (vehicle.getCurrentSpeedKmHour() < 100) {
            actions.acceleration = true;
        }
    }
}

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});


//attach key event handlers
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);