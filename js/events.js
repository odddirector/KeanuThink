//key up event handler
function keyup(e) {
    if (keysActions[e.code]) {
        actions[keysActions[e.code]] = false;
    }
}

//key down event handler
function keydown(e) {
    console.log(e.code);
    if (keysActions[e.code]) {
        actions[keysActions[e.code]] = true;
    }
}

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});


//attach key event handlers
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);