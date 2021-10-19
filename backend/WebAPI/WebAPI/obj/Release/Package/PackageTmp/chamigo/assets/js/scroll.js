// window.addEventListener('scroll',scrollOffset);

let showBackground = false;

function scrollOffset() {
  const scroll = window.pageYOffset;
  const menuNavbar = document.getElementById('menu')
  if (scroll > 0){
    menuNavbar.classList.add('scroll');
    showBackground = true;
  }
  else {
    menuNavbar.classList.remove('scroll');
    showBackground = false;
  }
}



