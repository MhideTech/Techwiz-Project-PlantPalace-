const navBar = document.querySelector(`.nav`);
const openNav = document.querySelector(`.nav-open-button`);

class App {
  constructor() {
    openNav.addEventListener(`click`, this.#openNav);
  }

  #openNav() {
    openNav.classList.toggle(`close`);
    navBar.classList.toggle(`hidden`);
  }
}

const app = new App();
