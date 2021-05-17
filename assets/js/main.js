// contentful data
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
let closeCartBtn = document.querySelector(".close-cart");
let searchToggleBtn = document.querySelector(".nav-icon.search");
let navListButtons = document.querySelectorAll(".nav-list a");
let featuredProductsDom = document.querySelector(".featured-products-content");
let newArrivalsProductsDom = document.querySelector(".new-arrivals-content");
let singleProductDom = document.querySelector(".single-product-dom");
let cartProductsDom = document.querySelector(".cart-product-dom");
let cartCountDom = document.querySelector(".cart-count");
let cartProductsTotal = document.querySelector(".cart-products-total");
let cartProducts = [];
let productsItems = [];
let initProductsAvailableCount = [];

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
      let dom = new DomUi();
      SaveLocalStorage.saveAvailable(dom.initAvailable(products));
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

  showCart() {
    // open cart and close nav & search
    cartBar.classList.add("show-slide-right");
    navBar.classList.remove("show-slide-right");
    searchBar.classList.remove("show-slide-top");
  }

  hideCart() {
    // open cart and close nav & search
    cartBar.classList.remove("show-slide-right");
    navBar.classList.remove("show-slide-right");
    searchBar.classList.remove("show-slide-top");
  }

  toggleSearch() {
    // open search and close nav & cart
    searchBar.classList.toggle("show-slide-top");
    navBar.classList.remove("show-slide-right");
    cartBar.classList.remove("show-slide-right");
  }

  //
  navListClick() {
    navToggleBtn.addEventListener("click", this.toggleNav);
    navListButtons.forEach((button) => {
      button.addEventListener("click", this.toggleNav);
    });
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
    // get all view product buttons
    let viewProductBtn = [...document.querySelectorAll(".view-product")];
    // click event for all buttons
    viewProductBtn.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        //
        document.body.style.overflow = "hidden";

        // hide cart sidebar
        this.hideCart();

        // get current button id
        let id = button.dataset.id;

        // current product
        let product = products.find((item) => item.id === id);

        // display current product
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
        // add product to dom view screen
        singleProductDom.innerHTML = singleProduct;

        // save current product to local storage
        SaveLocalStorage.saveProduct(product);

        // close currrent product
        let closeBtn = document.querySelector(".close-btn");
        closeBtn.addEventListener("click", this.closeViewProduct);

        // add current product to cart when click add to cart button
        let addBtn = document.querySelector(".single-product-add");
        addBtn.addEventListener("click", (e) => {
          // get current product id
          let id = e.target.dataset.id;

          // get current product item
          let item = products.find((product) => product.id === id);

          // set product available count
          if (!item.inCart) {
            item.amount = 1;
            item.available = item.available - 1;
          }

          // add product item to cart
          this.addProductToCart(item);

          // set item in cart
          if (item.amount > 0) {
            item.inCart = true;
          } else {
            item.inCart = false;
          }

          // save all products to local storage
          SaveLocalStorage.saveProducts(products);
        });
      });
    });
  }

  // add single product item to cart
  addProductToCart(item) {
    let product = item;

    // add product to cart only if product not in cart
    if (!product.inCart) {
      // add to cart
      cartProducts.push(product);

      // add to local storage cart
      SaveLocalStorage.saveCart(cartProducts);

      // set products count in cart and total price
      this.setCartInfo(cartProducts);

      // display product to dom
      this.displayCartProducts();

      // close product view screen
      this.closeViewProduct();

      // show cart sidebar
      this.showCart();
    }
  }

  // display cart products
  displayCartProducts() {
    let cartDom = ``;

    // get all products if have amount >= 1
    cartProducts = cartProducts.filter((product) => product.amount >= 1);

    // display products
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
              <div>total : $ ${product.amount * product.price}</div>
              <span class="remove-item disabled-user-select" data-id=${
                product.id
              }>
                remove product
              </span>
            </div>
          </div>
    `;
    });

    // display in dom
    cartProductsDom.innerHTML = cartDom;
  }

  closeViewProduct() {
    singleProductDom.innerHTML = "";
    document.body.style.overflow = "initial";
  }

  saveAppInfo() {
    cartProducts = SaveLocalStorage.getCart();
    this.setCartInfo(cartProducts);
  }

  setCartInfo(cartProducts) {
    // set in cart product count
    cartCountDom.textContent = cartProducts.length;

    // set all products total price
    let total = 0;
    cartProducts.map((product) => {
      total += product.price * product.amount;
    });

    cartProductsTotal.innerHTML = `

      Cart Total : $${parseFloat(total).toFixed(2)}
    
      
    `;
  }

  removeCartItem(id) {
    // get cart products not equal id
    cartProducts = cartProducts.filter((product) => product.id !== id);
    let product = productsItems.find((item) => item.id === id);
    //
    let initAvailable = SaveLocalStorage.getAvailable();
    initAvailable = initAvailable.find((ava) => ava.id === id);

    product.inCart = false;
    product.available = initAvailable.available;
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
        if (product.available > 0) {
          product.available = product.available - 1;
          product.amount = product.amount + 1;
        }

        let product2 = productsItems.find((product) => product.id === id);
        product2.amount = product.amount;
        product2.available = product.available;
        SaveLocalStorage.saveProducts(productsItems);

        SaveLocalStorage.saveCart(cartProducts);
        this.setCartInfo(cartProducts);
        SaveLocalStorage.saveProducts(productsItems);
        this.displayCartProducts();
        e.target.nextElementSibling.innerText = product.amount;
      } else if (e.target.classList.contains("decrease")) {
        const id = e.target.dataset.id;

        let product = cartProducts.find((product) => product.id === id);

        let product2 = productsItems.find((product) => product.id === id);

        if (product.amount > 0) {
          product.available = product.available + 1;
          product.amount = product.amount - 1;
          product2.amount = product.amount;
          product2.available = product.available;
        }

        if (product.amount == 0) {
          product.inCart = false;
          cartProducts = cartProducts.filter((product) => product.id !== id);
          product2.inCart = false;
          product2.amount = 0;
        }

        SaveLocalStorage.saveCart(cartProducts);
        SaveLocalStorage.saveProducts(productsItems);
        this.displayCartProducts();
        this.setCartInfo(cartProducts);
        this.viewSingleProduct(productsItems);
      }
    });
  }

  initAvailable(products) {
    const availableProducts = [...products];
    initProductsAvailableCount = availableProducts.map((product) => {
      let { available, id } = product;
      return { available, id };
    });
    return initProductsAvailableCount;
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

  // save init available count for all products
  static saveAvailable(available) {
    localStorage.setItem("available", JSON.stringify(available));
  }

  // get init available count for all products from local storage
  static getAvailable() {
    return localStorage.getItem("available")
      ? JSON.parse(localStorage.getItem("available"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let dom = new DomUi();
  let products = new Products();

  dom.saveAppInfo();
  // open nav sidebar on click
  dom.navListClick();
  // open cart sidebar on click
  cartToggleBtn.addEventListener("click", dom.toggleCart);
  closeCartBtn.addEventListener("click", dom.hideCart);
  // open cart sidebar on click
  searchToggleBtn.addEventListener("click", dom.toggleSearch);
  // get all products
  products.getProducts().then((products) => {
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
  });
});
