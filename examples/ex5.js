const converterEle = document.getElementById("converter");
const convertFirst_ELe = document.getElementById("first-value");
const convertFirstText_ELe = document.getElementById("convertfirst-text");
const convertSecond_Ele = document.getElementById("second-value");
const convertSecondText_Ele = document.getElementById("convertsecond-text");
let converttype = "time";

const converters = {
  time: {
    label1: "Second",
    label2: "Minute",
    toSecond: (v) => v * 60,
    toFirst: (v) => v / 60,
  },
  temperature: {
    label1: "Celsius",
    label2: "Fahrenheit",
    toSecond: (v) => ((v - 32) * 5) / 9,
    toFirst: (v) => (v * 9) / 5 + 32,
  },
};

function handleDropdown(input) {
  converttype = input.value;

  convertFirst_ELe.value = "";
  convertSecond_Ele.value = "";

  const labelName = converters[converttype];

  convertFirstText_ELe.innerText = labelName.label1;
  convertSecondText_Ele.innerText = labelName.label2;
}

function handleTimeTem(input) {
  if (input.id === "first-value") {
    convertSecond_Ele.value = converters[converttype].toFirst(input.value);
  } else {
    convertFirst_ELe.value = converters[converttype].toSecond(input.value);
  }
}
