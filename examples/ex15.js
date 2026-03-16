const el = document.getElementById("simple-list");
const sharedEle = document.getElementById("shared-list");

new Sortable(el, {
  group: "shared",
  animation: 150,
});

new Sortable(sharedEle, {
  group: "shared",
  animation: 150,
});

function sortItem() {
  const liElements = Array.from(el.getElementsByTagName("LI"));
  const simpleList = liElements.map((li) => li.textContent);
  // liElements.forEach((li) => el.appendChild(li));

  const liElements2 = Array.from(sharedEle.getElementsByTagName("LI"));
  const sharedList = liElements2.map((li) => li.textContent);

  // liElements2
  //   .sort((a, b) => a.textContent.localeCompare(b.textContent))
  //   .forEach((li) => sharedEle.appendChild(li));
  saveData(simpleList, sharedList);
}

async function saveData(listA, listB) {
  try {
    const formData = new FormData();
    formData.append("listA", listA);
    formData.append("listB", listB);
    const res = await fetch("../apis/drag_drop/drag_and_drop.php", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (result.success && result?.id) {
      const url = new URL(window.location);
      url.searchParams.set("id", result?.id);
      history.replaceState({}, "", url);
      fetchData(result?.id);
    }

    showToast(result.message, result.success);
  } catch (error) {
    console.error(error);
  }
}

async function fetchData(id) {
  try {
    const res = await fetch(`../apis/drag_drop/drag_and_drop.php?id=${id}`, {
      method: "GET",
    });

    const result = await res.json();

    const listA = result.data?.listA?.split(",");
    const listB = result.data?.listB?.split(",");

    if (listA) {
      el.replaceChildren();
      listA.forEach((v) => {
        if (v) {
          const li = document.createElement("li");
          li.innerText = v;
          el.appendChild(li);
        }
      });
    }

    if (listB) {
      sharedEle.replaceChildren();
      listB.forEach((v) => {
        if (v) {
          const li = document.createElement("li");
          li.innerText = v;
          sharedEle.appendChild(li);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

const params = new URLSearchParams(window.location.search);
let id = params.get("id");

if (id) {
  fetchData(id);
}
