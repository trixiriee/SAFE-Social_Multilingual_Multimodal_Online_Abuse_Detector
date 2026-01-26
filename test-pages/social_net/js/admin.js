const isAdmin = true; // simulate role

if(!isAdmin){
  document.querySelector(".admin-only").style.display="none";
}

function toggleAdmin(){
  if(!isAdmin) return;
  document.getElementById("adminPanel").classList.toggle("open");
}
