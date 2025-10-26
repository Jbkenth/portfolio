const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const links = document.querySelectorAll('#mobile-menu .nav-link');
let menuOpen = false;

function openMenu() {
  mobileMenu.classList.remove('hidden');
  setTimeout(() => {
    mobileMenu.classList.add('show');
  }, 10);

  links.forEach((link, i) => {
    setTimeout(() => {
      link.classList.add('mobile-link-show', 'glow');
      link.classList.remove('mobile-link-hide');
    }, i * 250);
  });

  menuOpen = true;
}

function closeMenu() {
  // fade out links first
  links.forEach((link, i) => {
    setTimeout(() => {
      link.classList.remove('mobile-link-show', 'glow');
      link.classList.add('mobile-link-hide');
    }, i * 200);
  });

  // then fade out overlay
  mobileMenu.classList.remove('show');
  mobileMenu.classList.add('opacity-0');

  // after fade-out, hide completely
  setTimeout(() => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('opacity-0');
  }, 1000);

  menuOpen = false;
}

menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!menuOpen) openMenu();
  else closeMenu();
});

// click anywhere outside closes it
document.addEventListener('click', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && e.target !== menuBtn) {
    closeMenu();
  }
});

// clicking any link closes it too
links.forEach(link => {
  link.addEventListener('click', () => closeMenu());
});