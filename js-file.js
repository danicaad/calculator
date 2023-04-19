const ac = document.querySelector("#all-clear");
const clear = document.querySelector("#clear");
const del = document.querySelector("#delete");
const screenInput = document.querySelector("#screen-input");
const screenOutput = document.querySelector("#screen-output");

const numberButtons = document.querySelectorAll('.number');
numberButtons.forEach((number) => number.addEventListener("click", () => inputNumber(number.textContent)));

const operationButtons = document.querySelectorAll('.operation');
operationButtons.forEach((operation) => operation.addEventListener("click", () => chooseOperation(operation.textContent)));

const decimal = document.querySelector("#decimal");
decimal.addEventListener("click", () => addDecimal());

const sign = document.querySelector("#sign");
sign.addEventListener("click", () => changeSign());

ac.addEventListener("click", () => {
    clearInput();
    firstNumber = 0;
    secondNumber = 0;
    operation = "";
    screenOutput.textContent = "";
    isFirstNumber = true;
});

clear.addEventListener("click", () => {
    clearInput();
});

del.addEventListener("click", () => {
    tempInput = tempInput.substring(0, tempInput.length - 1);
    if (!tempInput.match(/\./)) {
        document.getElementById("decimal").disabled = false;
    }  
    screenInput.textContent = tempInput === "" ? "0" : tempInput;
    console.log(tempInput);
});

let tempInput = "";
let isFirstNumber = true;
let firstNumber = 0;
let secondNumber = 0;
let operation = "";

function inputNumber(n) {
    if (tempInput.length == 18) {
        return;
    }
    if (operation === "=") {
        tempInput = "";
        operation = "";
    }
    if (tempInput !== "0") {
        tempInput += n;
        screenInput.textContent = tempInput;
    }
}

function clearInput() {
    screenInput.textContent = "0";
    document.getElementById("decimal").disabled = false;
    tempInput = "";
}

function chooseOperation(op) {
    if (operation === "=" && tempInput === "") {
        return;
    }
    if (tempInput.charAt(tempInput.length - 1) === ".") {
        tempInput = tempInput.slice(0, -1);
    }
    if (isFirstNumber) {
        if (tempInput === "") {
            tempInput = "0";
        }
        screenOutput.textContent = `${tempInput} ${op}`;
        document.getElementById("decimal").disabled = false;
        operation = op;
        if (op === "=") {
            screenInput.textContent = `${tempInput}`;
            firstNumber = parseFloat(tempInput);
            console.log(isFirstNumber);
            return;
        }
        firstNumber = parseFloat(tempInput);
        tempInput = "";
        
        isFirstNumber = false;     
        return;
    }
    if (op === "="){
        if (operation !== "" && tempInput !== "") {
            screenOutput.textContent = `${firstNumber} ${operation} ${tempInput} =`;
            operate(operation);
        } else if (operation !== "" && tempInput == "") {
            screenOutput.textContent = `${firstNumber} =`;
        }
        isFirstNumber = true;
        tempInput = firstNumber;
        operation = op;
        document.getElementById("decimal").disabled = false;
        screenInput.textContent = `${firstNumber}`;  
        return;
    }    
    if (operation !== "" && tempInput !== "") {
        operate(operation);
        operation = op;
        screenOutput.textContent = `${firstNumber} ${op} ${tempInput}`;
    }
} 

function operate(operation) {
    switch (operation) {
        case "+":
            firstNumber = firstNumber + parseFloat(tempInput);
        break;
        case "-":
            firstNumber = firstNumber - parseFloat(tempInput);
        break;
        case "÷":
            firstNumber = firstNumber / parseFloat(tempInput);
        break;
        case "x":
            firstNumber = firstNumber * parseFloat(tempInput);
        break;
    }
    firstNumber = Math.round(firstNumber * 10) / 10;
    tempInput = "";
}

function addDecimal () {
    if (operation === "=") {
        tempInput = "";
        operation = "";
    }
    tempInput = tempInput === "" ? "0." : tempInput + ".";
    screenInput.textContent = tempInput;
    document.getElementById("decimal").disabled = true;
}

function changeSign () {
    if (tempInput === "" || tempInput === 0) return;
    if (tempInput.charAt(0) !== "-") {
        tempInput = "-" + tempInput;
    } else if (tempInput.charAt(0) === "-") {
        tempInput = tempInput.slice(1);
        console.log(tempInput);
    }
    screenInput.textContent = tempInput;
}