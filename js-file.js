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

ac.addEventListener("click", () => clearAll());
clear.addEventListener("click", () => clearInput());
del.addEventListener("click", () => deleteCharacter());

let isFirstNumber = true;
let hasDecimal = false;
let tempInput = "";
let firstNumber = 0;
let operation = "";

const acceptedKeys = {
    numberKeys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    operationKeys: ['+', '-', '/', '*', '=', "Enter"],
    editKeys: ["Backspace", 'a', 'c', 's', '.'],
};

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "/") e.preventDefault();
    useKeys(e.key);

});

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

function chooseOperation(op) {
    if (operation === "=" && tempInput === "") {
        return;
    }
    if (tempInput.charAt(tempInput.length - 1) === ".") tempInput = tempInput.slice(0, -1);
    if (isFirstNumber) {
        if (tempInput === "") tempInput = "0";    
        screenOutput.textContent = `${tempInput} ${op}`;
        hasDecimal = false;
        document.getElementById("decimal").disabled = false;
        operation = op;
        if (op === "=") {
            screenInput.textContent = `${tempInput}`;
            firstNumber = parseFloat(tempInput);
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
        tempInput = firstNumber.toString();
        firstNumber = 0;
        operation = op;
        hasDecimal = false;
        document.getElementById("decimal").disabled = false;
        screenInput.textContent = `${tempInput}`;  
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
        case "/":
        case "÷":
            if (tempInput === "0") {
                alert("Dividing by zero is not allowed.");
                screenOutput.textContent = "ERROR";
                firstNumber = 0;
                return;
            }
            firstNumber = firstNumber / parseFloat(tempInput);
        break;
        case "*":
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
    hasDecimal = true;
    document.getElementById("decimal").disabled = true;
}

function changeSign () {
    if (operation === "=" || tempInput === "" || tempInput === "0" || tempInput === "0.") return;
    if (tempInput.charAt(0) !== "-") {
        tempInput = "-" + tempInput;
    } else if (tempInput.charAt(0) === "-") {
        tempInput = tempInput.slice(1);
    }
    screenInput.textContent = tempInput;
}

function clearInput() {
    screenInput.textContent = "0";
    hasDecimal = false;
    document.getElementById("decimal").disabled = false;
    tempInput = "";
}

function clearAll () {
    clearInput();
    firstNumber = 0;
    operation = "";
    screenOutput.textContent = "";
    isFirstNumber = true;
}

function deleteCharacter () {
    if (isFirstNumber && operation === "=") {
        clearAll();
    }
    tempInput = tempInput.substring(0, tempInput.length - 1);
    if (!tempInput.match(/\./)) {
        hasDecimal = false;
        document.getElementById("decimal").disabled = false;
    }
    screenInput.textContent = tempInput === "" ? "0" : tempInput;
}

function useKeys (value) {
    if (acceptedKeys.numberKeys.includes(value)) inputNumber(value);
    if (acceptedKeys.operationKeys.includes(value)) {
        if (value === "Enter") value = "=";
        chooseOperation(value);
    };
    if (acceptedKeys.editKeys.includes(value)) {
        switch (value) {
            case "Backspace":
                deleteCharacter();
            break;
            case '.':
                if (!hasDecimal) addDecimal();
            break;
            case 'a':
                clearAll();
            break;
            case 'c':
                clearInput();
            break;
            case 's':
                changeSign();
            break;
        }
    };
}
