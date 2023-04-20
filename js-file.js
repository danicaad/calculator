const acBtn = document.querySelector("#all-clear");
const clearBtn = document.querySelector("#clear");
const delBtn = document.querySelector("#delete");
const screenInput = document.querySelector("#screen-input");
const screenOutput = document.querySelector("#screen-output");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operation");

//UI button functionality
clearBtn.addEventListener("click", () => clear());
numbers.forEach((number) => number.addEventListener("click", () => inputDigit(number.textContent)));
operators.forEach((operator) => operator.addEventListener("click", () => operate(operator.textContent)));
acBtn.addEventListener ("click", () => clearAll());
//keyboard functionality
const allowedKeys = {
    numberKeys: ['0','1','2','3','4','5','6','7','8','9'],
    operationKeys: ['+','-','/','*',"=","Enter"],
};

window.addEventListener("keydown", (e) => {
    if (allowedKeys.numberKeys.includes(e.key)) inputDigit(e.key);
    if (allowedKeys.operationKeys.includes(e.key)) {
        //prevent problematic behaviors with the Enter and / keys
        if (e.key === "Enter" || e.key === "/") e.preventDefault();
        operate(e.key);
    }
});

let firstOperand = 0;
let secondOperand = 0;
let currentOperator = "";
let tempString = "";
let isFirstOperand = true;

function inputDigit(n) {
    //prevent input of multiple zeros not between non-zero numbers or after a decimal point
    if (tempString.charAt(0) === "0" && tempString.charAt(1) !== ".") {
        if (n === "0") return;
        tempString = "";
    }
    tempString += n;
    screenInput.textContent = tempString;
    console.log(`inputDigit ${tempString}`);
}

function clear() {
    tempString = "";
    console.log(`clear value of tempString: ${tempString}`);
    screenInput.textContent = "0";
}

function clearAll () {
    clear();
    firstOperand = 0;
    secondOperand = 0;
    currentOperator = "";
    tempString = "";
    isFirstOperand = true;
    screenOutput.textContent = "";
}

function operate(op) {
    if (isFirstOperand) {
        currentOperator = op === "Enter" ? "=" : op;
        firstOperand = parseFloat(tempString);
        tempString = "";
        screenOutput.textContent = `${firstOperand} ${currentOperator}`;
        isFirstOperand = false;
    } else {
        secondOperand = tempString === "" ? 0 : parseFloat(tempString);
        if (op === "=" || op === "Enter"){
            if (currentOperator !== "=") {
                screenOutput.textContent = `${firstOperand} ${currentOperator} ${secondOperand} =`;
                evaluate(currentOperator);
            }
            secondOperand = 0;
            tempString = firstOperand.toString();
            isFirstOperand = true;
        } else {
            evaluate(currentOperator);
            currentOperator = op;
            screenOutput.textContent = `${firstOperand} ${currentOperator}`;
            tempString = "";
        }
    }
}
function evaluate (operator) {
    switch (operator) {
        case '+':
            firstOperand = add(firstOperand, secondOperand);
            console.log(`Sum is ${firstOperand}`);
            break;
        case '-':
            firstOperand = subtract(firstOperand, secondOperand);
            console.log(`Difference is ${firstOperand}`);
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
            console.log(`Quotient is ${firstOperand}`);
            break;
        case 'x':
        case '*':
            firstOperand = multiply(firstOperand, secondOperand);
            console.log(`Product is ${firstOperand}`);
            break;
    }
    screenInput.textContent = `${firstOperand}`;
} 

//operator functions
function add (a, b) {return a + b};
function subtract (a, b) {return a - b};
function divide (a, b) {return a / b};
function multiply (a, b) {return a * b};