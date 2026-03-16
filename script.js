function setActiveTab() {
  const url = window.location.pathname.split("/").pop().replace(".html", "");
  const header = document.getElementById(url);
  if (header && url) {
    if (url === header.getAttribute("id")) {
      header.style.backgroundColor = "blue";
    }
  }
}
//Fetch sidebar and tailwind css
(async function () {
  try {
    const script = document.createElement("script");
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    link.rel = "stylesheet";
    script.src = "https://cdn.tailwindcss.com/3.3.1";
    document.head.appendChild(script);
    document.head.appendChild(link);
    const res = await fetch("../layout/layout.html");
    const html = await res.text();
    if (res.status === 200) {
      document.getElementById("layout").innerHTML = html;
      setActiveTab();
    }
  } catch (error) {
    console.error(error);
  }
})();

function showToast(content = "", success) {
  var x = document.getElementById("toast");
  x.innerHTML = content;
  x.className = "show";
  if (success) {
    x.classList.add("success");
  }
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
