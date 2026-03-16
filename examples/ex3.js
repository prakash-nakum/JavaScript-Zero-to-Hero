const priceEle = document.getElementById("price");
const quantityEle = document.getElementById("quantity");
const priceqty = document.getElementById("priceqty");

let priceXquantity = 1;

function handlePriceQty(type, value) {
  if (type === "price") {
    priceXquantity = quantityEle.value ? quantityEle.value * value : value;

    priceqty.innerText = priceXquantity;
  } else {
    priceXquantity = priceEle.value ? priceEle.value * value : value;
    priceqty.innerText = priceXquantity;
  }
}
