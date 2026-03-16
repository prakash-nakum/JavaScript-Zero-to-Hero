const wrapEle = document.getElementById("membersWrap");
const rows = wrapEle.getElementsByClassName("member-row");
const formEle = document.getElementById("userinfo");
const addBtn = document.getElementById("addBtn");
const removeBtn = document.getElementById("removeBtn");
const formsubmitBtn = document.getElementById("form-submit-button");
const formCancleBtn = document.getElementById("form-cancle-button");

//input element
const inputs = {
  name: document.getElementById("name"),
  url: document.getElementById("url"),
  funnel: document.getElementById("funnel"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  confirmpassword: document.getElementById("confirmpassword"),
};

let params = new URLSearchParams(document.location.search);
const user_id = params.get("id");
let isViewMode = user_id ? true : false;
if (isViewMode) {
  getUserById(user_id);
  disablAllButtonAndInputs();
}

function addRow(data) {
  const firstRow = document.querySelector(`[data-member="member"]`);
  const clone = firstRow.cloneNode(true);
  const inputs = clone.getElementsByTagName("input");
  const errEl = clone.getElementsByTagName("span");

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
    errEl[i].innerText = "";
  }
  if (typeof data !== "undefined") {
    if (wrapEle.children.length === data.length) {
      wrapEle.lastElementChild.innerHTML = "";
    }
  }

  wrapEle.appendChild(clone);

  if (data && data.length !== 0) {
    const inputs = wrapEle.getElementsByTagName("input");

    data.forEach((item, index) => {
      const membersindex = index * 2;
      const percentageIndex = index * 2 + 1;

      if (inputs[membersindex]) {
        inputs[membersindex].value = item.members;
      }
      if (inputs[percentageIndex]) {
        inputs[percentageIndex].value = item.percentage;
      }
    });
  }
}

async function handleFormSubmit() {
  if (isViewMode) {
    return;
  }
  let valid = true;
  const inputs = formEle.querySelectorAll("input");

  inputs.forEach((inp) => {
    if (inp.value.trim() === "") {
      inp.nextElementSibling.textContent = "This field is required";
      valid = false;
    }
  });

  if (!valid) return;

  const data = collectFormData();

  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) =>
    formData.append(k, typeof v === "object" ? JSON.stringify(v) : v),
  );

  try {
    const res = await fetch("../apis/user/add_user.php", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    showToast(data.message, data.success);

    if (data.id) {
      disablAllButtonAndInputs();
      data.id ? getUserById(data.id) : "";
    }
  } catch (error) {
    console.error(error);
  }
}

function disablButton(ele) {
  ele.disabled = true;
  ele.classList.add("cursor-not-allowed");
}

function disablAllButtonAndInputs() {
  disablButton(addBtn);
  wrapEle.querySelectorAll(".removeBtn").forEach((el) => disablButton(el));
  disablButton(formsubmitBtn);
  disablButton(formCancleBtn);
  const inputs = formEle.querySelectorAll("input");
  inputs.forEach((inp) => {
    inp.readOnly = true;
    inp.disabled = true;
  });
}

async function getUserById(id) {
  let url = new URL(window.location);
  if (!isViewMode) {
    window.history.pushState({}, "", window.location.href + "?id=" + id);
    isViewMode = true;
    return;
  }

  try {
    const res = await fetch(`../apis/user/get_user_by_id.php?id=${id}`, {
      method: "GET",
    });

    const result = await res.json();
    console.log(result);

    if (result?.data && isViewMode) {
      const rowdata = JSON.parse(result?.data?.user);
      for (let i = 0; i < rowdata?.length; i++) {
        addRow(rowdata);
      }

      Object.keys(inputs).forEach(
        (k) => (inputs[k].value = result?.data[k] || ""),
      );
    }
  } catch (error) {
    console.error(error);
  }
}

function collectFormData() {
  const user = [];

  document.querySelectorAll(".members-percentage").forEach((row) => {
    user.push({
      members: row.querySelector(".members").value,
      percentage: row.querySelector(".percentage").value,
    });
  });

  return {
    ...Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, v.value])),
    user: user,
  };
}

formEle.addEventListener("input", (e) => {
  if (e.target.tagName === "INPUT") {
    if (e.target.nextElementSibling)
      e.target.nextElementSibling.textContent = "";
  }
});

function removeRow(btn) {
  if (rows.length > 1) {
    btn.parentNode.remove();
  }
}
