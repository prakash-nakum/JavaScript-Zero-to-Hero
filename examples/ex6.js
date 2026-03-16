const rcolorEle = document.getElementById("rValue");
const rRangeEle = document.getElementById("rRange");

const gcolorEle = document.getElementById("gValue");
const gRangeEle = document.getElementById("gRange");

const bcolorEle = document.getElementById("bValue");
const bRangeEle = document.getElementById("bRange");

const colorPreviewEle = document.getElementById("colorPreview");

function updateColorByRange(color) {
  document.getElementById(color + "Value").value = document.getElementById(
    color + "Range",
  ).value;
  updateColor();
}

function updateColor() {
  console.log(123);

  const r = rcolorEle.value;
  const g = gcolorEle.value;
  const b = bcolorEle.value;

  rRangeEle.value = r;
  gRangeEle.value = g;
  bRangeEle.value = b;
  const rgb = `rgb(${r}, ${g}, ${b})`;
  colorPreviewEle.style.backgroundColor = rgb;
}
