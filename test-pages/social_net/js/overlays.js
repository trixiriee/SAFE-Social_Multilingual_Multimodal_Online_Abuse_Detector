function openSearch(){
  document.getElementById("searchOverlay").style.display="flex";
}

document.getElementById("searchOverlay").onclick = () =>
  document.getElementById("searchOverlay").style.display="none";

function toggleNotifications(){
  document.getElementById("notifications").classList.toggle("open");
}
