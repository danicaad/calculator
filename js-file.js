const ac = document.querySelector("#all-clear");
const clear = document.querySelector("#clear");
const del = document.querySelector("#delete");

const numberButtons = document.querySelectorAll('.number');

numberButtons.forEach((number) => number.addEventListener("click", () => inputNumber(number.textContent)));

const screenInput = document.querySelector("#screen-input");

ac.addEventListener("click", () => {
    screenInput.textContent = "0";
    tempInput = "";
});

del.addEventListener("click", () => {
    tempInput = tempInput.substring(0, tempInput.length - 1);
    screenInput.textContent = tempInput === "" ? "0" : tempInput;
    console.log(tempInput);
});

let tempInput = "";
let isFirstNumber = true;


function inputNumber(n) {
    if (tempInput.length == 18) {
        return;
    }
    if (tempInput !== "0") {
        tempInput += n;
        console.log(tempInput);
        screenInput.textContent = tempInput;
    }
}

