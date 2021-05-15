// variables
let navBar = document.querySelector(".nav-sideabr");
let cartBar = document.querySelector(".cart-products-items");
let searchBar = document.querySelector(".search-input");
let navToggleBtn = document.querySelector(".hamburger-toggle");
let cartToggleBtn = document.querySelector(".nav-icon.cart");
let searchToggleBtn = document.querySelector(".nav-icon.search");

class DomUi {
  // show & hide cart and nav method
  toggleNav() {
    // open nav and close cart & search
    navBar.classList.toggle("show-slide-right");
    cartBar.classList.remove("show-slide-right");
    searchBar.classList.remove("show-slide-top");
  }

  toggleCart() {
    // open cart and close nav & search
    cartBar.classList.toggle("show-slide-right");
    navBar.classList.remove("show-slide-right");
    searchBar.classList.remove("show-slide-top");
  }

  toggleSearch() {
    // open search and close nav & cart
    searchBar.classList.toggle("show-slide-top");
    navBar.classList.remove("show-slide-right");
    cartBar.classList.remove("show-slide-right");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let dom = new DomUi();
  // open nav sidebar on click
  navToggleBtn.addEventListener("click", dom.toggleNav);
  // open cart sidebar on click
  cartToggleBtn.addEventListener("click", dom.toggleCart);
  // open cart sidebar on click
  searchToggleBtn.addEventListener("click", dom.toggleSearch);
});
