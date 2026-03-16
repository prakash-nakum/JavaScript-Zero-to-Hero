function handleClone() {
  const listA = document.getElementById("listA");
  const listB = document.getElementById("listB");

  //Clone only last element
  const node = listB.lastElementChild;
  const clone = node.cloneNode(true);
  listA.appendChild(clone);
}
