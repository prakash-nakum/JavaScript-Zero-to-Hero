function addCounter() {
  const template = document.getElementById("counter-template");
  const clone = template.cloneNode(true);
  clone.style.display = "flex";
  clone.removeAttribute("id");
  document.getElementById("counters-container").appendChild(clone);
}
const OPERATION_TYPE = {
  INCREMENT: "increment",
  DECREMENT: "decrement",
};

function incrementOrdecrement(type) {
  const inputELe = this.parentNode.querySelector(`[data-count="countValue"]`);
  const currentValue = inputELe.value;

  if (type === OPERATION_TYPE.INCREMENT) {
    const newValue = increment(currentValue);
    inputELe.value = newValue;
  } else if (OPERATION_TYPE.INCREMENT) {
    const newValue = decrement(currentValue);
    inputELe.value = newValue;
  } else {
    console.log("Something wrong !");
  }
}

function increment(currentValue) {
  return ++currentValue;
}
function decrement(currentValue) {
  return --currentValue;
}
