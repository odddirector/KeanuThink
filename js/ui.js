document.querySelector("#typing").addEventListener("keyup", function (e) {
    localStorage.setItem("typing", document.querySelector("#typing").value);
});

document.querySelector("#typing").value = localStorage.getItem("typing"); 


document.querySelector("#f_work").addEventListener("click", function (e) {
    document.querySelector("body").classList = "play";
});


