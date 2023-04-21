const acBtn = document.querySelector("#all-clear");
const clearBtn = document.querySelector("#clear");
const delBtn = document.querySelector("#delete");
const decimalBtn = document.querySelector("#decimal");
const signBtn = document.querySelector("#sign");
const screenInput = document.querySelector("#screen-input");
const screenOutput = document.querySelector("#screen-output");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operation");

//UI button functionality
acBtn.addEventListener ("click", () => clearAll());
clearBtn.addEventListener("click", () => {
    clear();
    screenInput.textContent = "0";
});
delBtn.addEventListener("click", () => deleteDigit());
decimalBtn.addEventListener("click", () => addDecimal());
signBtn.addEventListener("click", () => changeSign());
numbers.forEach((number) => number.addEventListener("click", () => inputDigit(number.textContent)));
operators.forEach((operator) => operator.addEventListener("click", () => operate(operator.textContent)));

//keyboard functionality
const allowedKeys = {
    numberKeys: ['0','1','2','3','4','5','6','7','8','9'],
    operationKeys: ['+','-','/','*','=',"Enter","Backspace", "a", "c", "s", "."],
};

function pressKey (keyID) {
    let btn = document.getElementById(`${keyID}`);
    btn.click();
    btn.classList.add("active");
}

function releaseKey (keyID) {
    let btn = document.getElementById(`${keyID}`);
    btn.classList.remove("active");
}

window.addEventListener("keydown", (e) => {
    if (allowedKeys.numberKeys.includes(e.key)) {
        pressKey(e.code);
    }
    if (allowedKeys.operationKeys.includes(e.key)) {
        //prevent problematic behaviors with the Enter and / keys
        if (e.key === "Enter" || e.key === "/") e.preventDefault();
        switch (e.key) {
            case "+":
                pressKey("add");
                break;
            case "-":
                pressKey("subtract");
                break;
            case "/":
                pressKey("divide");
                break;
            case "*":
                pressKey("multiply");
                break;
            case "=":
            case "Enter":
                pressKey("equal");
                break;
            case "Backspace":
                pressKey("delete");
                break;
            case "a":
                pressKey("all-clear");            
                break;
            case "c":
                pressKey("clear");
                break;
            case "s":
                pressKey("sign");
                break;
            case ".":
                pressKey("decimal");
                break;
        }
    }
});

window.addEventListener("keyup", (e) => {
    if (allowedKeys.numberKeys.includes(e.key)) {
        releaseKey(e.code);
    }
    if (allowedKeys.operationKeys.includes(e.key)) {
        switch (e.key) {
            case "+":
                releaseKey("add");
                break;
            case "-":
                releaseKey("subtract");
                break;
            case "/":
                releaseKey("divide");
                break;
            case "*":
                releaseKey("multiply");
                break;
            case "=":
            case "Enter":
                releaseKey("equal");
                break;
            case "Backspace":
                releaseKey("delete");
                break;
            case "a":
                releaseKey("all-clear");           
                break;
            case "c":
                releaseKey("clear");
                break;
            case "s":
                releaseKey("sign");
                break;
            case ".":
                releaseKey("decimal");
                break;
        }
    }  
});

let firstOperand = 0;
let secondOperand = 0;
let currentOperator = "";
let tempString = "";
let firstString = "";
let secondString = "";
let isFirstOperand = true;
let hasOverflow = false;

function inputDigit(n) {
    //prevent input of multiple zeros not between non-zero numbers or after a decimal point
    if (tempString.charAt(0) === "0" && tempString.charAt(1) !== ".") {
        if (n === "0") return;
        tempString = "";
    }
    //reset value of tempString if input follows an equal operation
    if (currentOperator === "=")
    {
        tempString = "";
        currentOperator = "";
    }
    //check if current input has overflow
    if (tempString.length >= 18) {
        tempString = convertOverflow(tempString);
        hasOverflow = true;
    }
    if (!hasOverflow) {
        tempString += n;
    }
    screenInput.textContent = tempString;
    
}

function deleteDigit () {
    if (tempString === "" || currentOperator === "=") return;
    if (hasOverflow) {
        clear();
        return;
    }
    tempString = tempString.slice(0,-1);
    if (tempString === "-") tempString = "";
    screenInput.textContent = tempString === "" ? "0" : tempString;
}

function addDecimal () {
    let stringMatch = tempString.match(/\./);
    if (stringMatch) return;
    tempString = tempString === "" ? "0." : tempString + ".";
    screenInput.textContent = tempString;
}

function changeSign () {
    if (tempString === "") return; 
    tempString = tempString.charAt(0) === "-" ? tempString.slice(1) : "-" + tempString;
    screenInput.textContent = tempString;
}

function clear() {
    if (currentOperator === "=") {
        clearAll();
    } else {
        tempString = "";
        hasOverflow = false;
    }    
}

function clearAll () {
    tempString = "";
    firstOperand = 0;
    secondOperand = 0;
    currentOperator = "";
    isFirstOperand = true;
    hasOverflow = false;
    screenOutput.textContent = "";
    screenInput.textContent = "0";
    firstString = "";
    secondString = "";
}

function operate(op) {

    if (isFirstOperand) {
        if (tempString === "") return;
        currentOperator = op === "Enter" ? "=" : op;
        firstOperand = parseFloat(tempString);
        firstString = firstOperand.toString().length >= 17 ? convertOverflow(firstOperand.toString()) : firstOperand.toString();
        tempString = "";
        hasOverflow = false;
        screenOutput.textContent = `${firstString} ${currentOperator}`;
        screenInput.textContent = `${firstString}`;
        isFirstOperand = false;
    } else {       
        if (op === "=" || op === "Enter"){
            if (currentOperator === "=") return;
            secondOperand = tempString === "" ? firstOperand : parseFloat(tempString);
            secondString = secondOperand.toString().length >= 17 ? convertOverflow(secondOperand.toString()) : secondOperand.toString();
            screenOutput.textContent = `${firstString} ${currentOperator} ${secondString} =`;
            evaluate(currentOperator);
            currentOperator = "=";
            tempString = firstOperand.toString();
            isFirstOperand = true;
        } else {
            if (tempString === "") {
                currentOperator = op;
                screenOutput.textContent = `${firstString} ${currentOperator}`;
                return;
            };
            secondOperand = parseFloat(tempString);
            evaluate(currentOperator);
            currentOperator = op;
            screenOutput.textContent = `${firstString} ${currentOperator}`;
            clear();
        }
    }
}
function evaluate (operator) {
    switch (operator) {
        case '+':
            firstOperand = add(firstOperand, secondOperand);
            console.log(`${firstOperand} + ${secondOperand} = ${firstOperand}`);
            break;
        case '-':
            firstOperand = subtract(firstOperand, secondOperand);
            console.log(`${firstOperand} - ${secondOperand} = ${firstOperand}`);
            break;
        case '/':
        case '÷':
            if (secondOperand == 0) {
                alert("Division by zero is not allowed!");
                clearAll();
                screenOutput.textContent = "ERROR";
                screenInput.textContent = "0";
                return;
            }
            firstOperand = divide(firstOperand, secondOperand);
            console.log(`${firstOperand} / ${secondOperand} = ${firstOperand}`);
            break;
        case 'x':
        case '*':
            firstOperand = multiply(firstOperand, secondOperand);
            console.log(`${firstOperand} * ${secondOperand} = ${firstOperand}`);
            break;
    }
    firstString = firstOperand.toString().length >= 17 ? convertOverflow(firstOperand.toString()) : firstOperand.toString();
    screenInput.textContent = `${firstString}`;
} 

//operator functions
function add (a, b) {return a + b};
function subtract (a, b) {return a - b};
function divide (a, b) {return a / b};
function multiply (a, b) {return a * b};

function convertOverflow (text) {
    let converted = parseFloat(text);
    converted = converted.toPrecision(5);
    return converted;
}