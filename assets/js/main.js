const client = contentful.createClient({
  space: "ylv1jk2w42sy",
  accessToken: "RlBCUkuu7m4NE52ZmC5u46JRSlxnT4vYINAe07UVLWE",
});

// variables
let navBar = document.querySelector(".nav-sideabr");
let cartBar = document.querySelector(".cart-products-items");
let searchBar = document.querySelector(".search-input");
let navToggleBtn = document.querySelector(".hamburger-toggle");
let cartToggleBtn = document.querySelector(".nav-icon.cart");
let searchToggleBtn = document.querySelector(".nav-icon.search");
let featuredProductsDom = document.querySelector(".featured-products-content");
let newArrivalsProductsDom = document.querySelector(".new-arrivals-content");
let singleProductDom = document.querySelector(".single-product-dom");
let cartProductsDom = document.querySelector(".cart-products-items");
let cartCountDom = document.querySelector(".cart-count");
let cartProducts = [];
let productsItems = [];

class Products {
  async getProducts() {
    try {
      let contentful = await client.getEntries({
        content_type: "devlogsStore",
      });
      let products = contentful.items;
      products = products.map((item) => {
        const id = item.sys.id;
        const image = item.fields.image.fields.file.url;
        const {
          title,
          description,
          price,
          available,
          categoryBackpackMen,
          categoryBackpackWomen,
          categoryFeatured,
          categoryNewArrivals,
          isNew,
        } = item.fields;
        return {
          id,
          title,
          description,
          image,
          price,
          available,
          categoryBackpackMen,
          categoryBackpackWomen,
          categoryFeatured,
          categoryNewArrivals,
          isNew,
          ...{ inCart: false, amount: 1 },
        };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

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

  // Display featured products
  featuredProducts(products) {
    // get featured products only from all products
    const featuredProducts = products.filter(
      (product) => product.categoryFeatured
    );
    // save featuredProducts
    SaveLocalStorage.saveFeaturedProducts(featuredProducts);
    // variable for store dom data
    let productsDOM = ``;
    featuredProducts.forEach((product) => {
      productsDOM += `
          <article class="featured-product-item">
            ${
              product.isNew
                ? `<span class="product-status-date">new</span>`
                : ""
            }
            <div class="featured-product-img product-item">
              <img src=${product.image} alt="feature image" />
              <div class="product-overlay">
                <a href="#" class="view-product btn-primary" data-id=${
                  product.id
                }>
                  view product
                </a>
              </div>
            </div>
            <h2 class="featured-product-title">${product.title}</h2>
            <span class="featured-product-price">$${product.price}</span>
        </article>
      `;
    });

    featuredProductsDom.innerHTML = productsDOM;
  }

  // Display new arrivals products
  newArrivalsProducts(products) {
    // get new arrivals products only from all products
    const newArrivalsProducts = products.filter(
      (product) => product.categoryNewArrivals
    );
    // save newArrivalsProducts
    SaveLocalStorage.saveNewArrivalsProducts(newArrivalsProducts);
    // variable for store dom data
    let productsDOM = ``;
    newArrivalsProducts.forEach((product) => {
      productsDOM += `
          <div class="new-arrivals-img product-item">
            <img src=${product.image} alt="new-arrivals image" />
            <div class="product-overlay">
              <a href="#" class="view-product btn-primary" data-id=${product.id}>
                view product
              </a>
            </div>
          </div>
      `;
    });
    newArrivalsProductsDom.innerHTML = productsDOM;
  }

  // View single product
  viewSingleProduct(products) {
    let viewProductBtn = [...document.querySelectorAll(".view-product")];
    viewProductBtn.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        let id = button.dataset.id;
        let product = products.find((item) => item.id === id);

        let singleProduct = `
          <div class="single-product">
            <span class="close-btn">X</span>
            <div class="container">
              <div class="single-product-content">
                <div class="single-product-img">
                  <img src=${product.image} alt="feature image" />
                </div>
                <div class="single-product-info">
                  <h2 class="single-product-title">${product.title}</h2>
                  <span class="single-product-price">$${product.price}</span>
                  <span class="single-product-available">${
                    product.available
                  } items available</span>
                  <p class="single-product-description">
                    <span>Description : </span>
                    ${product.description}
                  </p>
                  <button class="single-product-add btn btn-primary" data-id=${
                    product.id
                  }>
                    ${product.inCart ? `InCart` : `Add to cart`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        singleProductDom.innerHTML = singleProduct;
        SaveLocalStorage.saveProduct(product);

        let closeBtn = document.querySelector(".close-btn");
        closeBtn.addEventListener("click", this.closeViewProduct);
        let addBtn = document.querySelector(".single-product-add");
        addBtn.addEventListener("click", (e) => {
          let id = e.target.dataset.id;
          let item = products.find((product) => product.id === id);
          if (!item.inCart) {
            item.available = item.available - 1;
          }
          item.inCart = true;
          SaveLocalStorage.saveProducts(products);
          this.addProductToCart();
        });
      });
    });
  }

  closeViewProduct() {
    singleProductDom.innerHTML = "";
  }

  // add single product to cart
  addProductToCart() {
    let product = SaveLocalStorage.getProduct();
    if (!product.inCart) {
      cartProducts.push(product);
      this.displayCartProducts();
      this.setCartInfo(cartProducts);
      this.closeViewProduct();
      this.toggleCart();
      SaveLocalStorage.saveCart(cartProducts);
    }
  }

  // display cart products
  displayCartProducts() {
    let cartDom = ``;
    cartProducts.forEach((product) => {
      cartDom += `
          <div class="cart-product">
            <div class="product-img">
              <img src=${product.image} alt="product" />
            </div>
            <div class="product-info">
              <h2 class="product-title">${product.title}</h2>
              <div class="set-product-count disabled-user-select">
                <span class="increase" data-id=${product.id}>+</span>
                <span class="product-count">${product.amount}</span>
                <span class="decrease" data-id=${product.id}>-</span>
              </div>
              <div>${product.available} Items Available</div>
              <span class="remove-item disabled-user-select" data-id=${product.id}>
                remove product
              </span>
            </div>
          </div>
    `;
    });

    cartProductsDom.innerHTML = cartDom;
  }

  saveAppInfo() {
    cartProducts = SaveLocalStorage.getCart();
    this.setCartInfo(cartProducts);
  }

  setCartInfo(cartProducts) {
    cartCountDom.textContent = cartProducts.length;
  }

  isAvailable(item) {
    item.available = item.available - 1;
  }

  removeCartItem(id) {
    cartProducts = cartProducts.filter((product) => product.id !== id);
    let product = productsItems.find((item) => item.id === id);
    if (product.inCart) {
      product.available = product.available + 1;
    }
    product.inCart = false;
    console.log(cartProducts);
    this.setCartInfo(cartProducts);
    SaveLocalStorage.saveCart(cartProducts);
    SaveLocalStorage.saveProducts(productsItems);
  }

  cartActions() {
    cartProductsDom.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-item")) {
        const id = e.target.dataset.id;
        this.removeCartItem(id);
        e.target.parentElement.parentElement.remove();
      } else if (e.target.classList.contains("increase")) {
        const id = e.target.dataset.id;
        let product = cartProducts.find((product) => product.id === id);
        product.available = product.available - 1;
        product.amount = product.amount + 1;
        SaveLocalStorage.saveCart(cartProducts);
        SaveLocalStorage.saveProducts(productsItems);
        e.target.nextElementSibling.innerText = product.amount;
      }
    });
  }
}

class SaveLocalStorage {
  // save all products to local storage
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  // get all products from local storage
  static getProducts() {
    return localStorage.getItem("products")
      ? JSON.parse(localStorage.getItem("products"))
      : [];
  }

  // save featured products to local storage
  static saveFeaturedProducts(featuredProducts) {
    localStorage.setItem("featuredProducts", JSON.stringify(featuredProducts));
  }
  // get featured products from local storage
  static getFeaturedProducts() {
    return localStorage.getItem("featuredProducts")
      ? JSON.parse(localStorage.getItem("featuredProducts"))
      : [];
  }

  // save new arrivals products to local storage
  static saveNewArrivalsProducts(newArrivalsProducts) {
    localStorage.setItem(
      "newArrivalsProducts",
      JSON.stringify(newArrivalsProducts)
    );
  }
  // get new arrivals products from local storage
  static getNewArrivalsProducts() {
    return localStorage.getItem("newArrivalsProducts")
      ? JSON.parse(localStorage.getItem("newArrivalsProducts"))
      : [];
  }

  // save single product to local storage
  static saveProduct(product) {
    localStorage.setItem("product", JSON.stringify(product));
  }
  // get single product from local storage
  static getProduct() {
    return localStorage.getItem("product")
      ? JSON.parse(localStorage.getItem("product"))
      : [];
  }

  // save cart products to local storage
  static saveCart(cartProducts) {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }
  // get cart products from local storage
  static getCart() {
    return localStorage.getItem("cartProducts")
      ? JSON.parse(localStorage.getItem("cartProducts"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let dom = new DomUi();
  let products = new Products();

  dom.saveAppInfo();

  // open nav sidebar on click
  navToggleBtn.addEventListener("click", dom.toggleNav);
  // open cart sidebar on click
  cartToggleBtn.addEventListener("click", dom.toggleCart);
  // open cart sidebar on click
  searchToggleBtn.addEventListener("click", dom.toggleSearch);
  // get all products
  products.getProducts().then((products) => {
    console.log(products);
    productsItems = localStorage.getItem("products")
      ? JSON.parse(localStorage.getItem("products"))
      : products;
    // display all products category
    dom.featuredProducts(productsItems);
    dom.newArrivalsProducts(productsItems);
    // display single product view product
    dom.viewSingleProduct(productsItems);
    // display cart products
    dom.displayCartProducts();
    dom.cartActions();
    // save all products to local storage
    SaveLocalStorage.saveProducts(productsItems);
  });
});
