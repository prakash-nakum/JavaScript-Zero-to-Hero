const countEle = document.getElementById("countvalue");
let count = 0;

function handleCounter(type) {
  if (type === "inc") {
    count += 1;
    countEle.innerText = count;
  } else {
    count -= 1;
    countEle.innerText = count;
  }
}
