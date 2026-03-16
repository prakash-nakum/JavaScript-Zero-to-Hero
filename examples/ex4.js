const celsiusEle = document.getElementById("celsius");
const fahrentheitEle = document.getElementById("fahrentheit");

function handleCelFah(type, value) {
  if (type === "celsius") {
    let fahrentheit = (value * 9) / 5 + 32;
    fahrentheitEle.value = fahrentheit;
  } else {
    let celsius = ((value - 32) * 5) / 9;
    celsiusEle.value = celsius;
  }
}
