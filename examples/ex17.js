const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const file = document.getElementById("file");
const userfile = document.getElementById("userfile");
const viewEle = document.getElementById("view");
const view = document.getElementById("view_model");

const view_model = new Modal(view);
async function handleFormSubmit() {
  try {
    const formData = new FormData(userfile);

    if (fname.value === "") {
      fname.nextElementSibling.textContent = "first name is required";
      return;
    }

    if (lname.value === "") {
      lname.nextElementSibling.textContent = "last name is required";
      return;
    }
    if (file.value === "") {
      file.nextElementSibling.textContent = "file is required";
      return;
    }

    const res = await fetch(`../apis/files/file.php`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    showToast(data.message, data.success);

    if (data.success && data.mimetype) {
      if (data.mimetype === "image/png" || data.mimetype === "image/jpeg") {
        view_model.show();
        viewEle.innerHTML = `<img class="w-full" src="${"../apis/" + data.filePath}" alt="Uploaded image">`;
      } else {
        view_model.show();
        viewEle.innerHTML = `<a   class="max-w-9 text-white bg-green-600 hover:bg-green-800 p-3 rounded font-semibold" href="${data.filePath}" download>Download File</a>`;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function closeModel() {
  view_model.hide();
}

userfile.addEventListener("input", (e) => {
  if (e.target.tagName === "INPUT") {
    if (e.target.nextElementSibling)
      e.target.nextElementSibling.textContent = "";
  }
});
