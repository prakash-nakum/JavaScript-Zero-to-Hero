const displayEle = document.getElementById("display");

let display = false;

let currentInput = "";
let currentOpration = "";
let prevInput = "";

function handleNumber(number) {
  if (!display) {
    currentInput += number;
  }

  if (display) {
    console.log(2);
    currentInput = number.toString();
    display = false;
  }
  displayEle.innerText = `${prevInput} ${currentOpration} ${currentInput}`;
}

function handleOpration(operation) {
  if (currentInput === "") return;
  if (prevInput !== "") {
    calculate();
  }
  currentOpration = operation;
  prevInput = displayEle.innerText;
  currentInput = "";
  displayEle.innerText = `${prevInput} ${currentOpration}`;
}

function calculate() {
  if (prevInput === "" || currentInput === "") return;
  let result;
  let prev = parseFloat(prevInput);
  let current = parseFloat(currentInput);

  switch (currentOpration) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "/":
      if (current === 0) {
        alert("Cannot divide by zero");
        return;
      }
      result = prev / current;
      break;
    case "%":
      result = (prev * current) / 100;
      break;
    default:
      return;
  }
  prevInput = "";
  currentOpration = "";
  currentInput = result.toString();
  displayEle.innerText = currentInput;
  display = true;
}

function handleChangesSign() {
  if (currentInput === "") return;
  if (displayEle.innerText > 0) {
    displayEle.innerText = -displayEle.innerText;
  } else {
    displayEle.innerText = Math.abs(displayEle.innerText);
  }
}

function handleClear() {
  displayEle.innerText = 0;
  currentOpration = "";
  currentInput = "";
  prevInput = "";
}
