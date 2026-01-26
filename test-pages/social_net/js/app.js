const app = document.getElementById("app");

function route(page){
  document.querySelectorAll(".nav-item")
    .forEach(n => n.classList.remove("active"));

  document.querySelector(`[data-route="${page}"]`)
    .classList.add("active");

  fetch(`${page}.html`)
    .then(r=>r.text())
    .then(html=>app.innerHTML=html);
}


route("feed");

function toggleTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
}
