const showhideEle = document.getElementById("showhide");

function handleShowHide(type) {
  if (type === "hide") {
    showhideEle.style = "visibility: hidden";
  } else {
    showhideEle.style = "display: block";
  }
}
