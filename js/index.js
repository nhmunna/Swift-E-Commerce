// UPDATE CART COUNT IN NAVBAR

function updateCartCount() {
  //console.log("Updating cart count in navbar");

  const cart = getCart();

  let totalItems = 0;
  if (cart && cart.items) {
    cart.items.forEach(function (item) {
      totalItems = totalItems + item.quantity;
    });
  }

  //console.log("Total items in cart: " + totalItems);

  const cartCountBadge = document.getElementById("cart-count");
  const itemCountBadge = document.getElementById("item-count");

  if (cartCountBadge) {
    if (totalItems > 0) {
      cartCountBadge.textContent = totalItems;
      cartCountBadge.style.display = "block";
      //console.log("Cart badge shown with count: " + totalItems);
    } else {
      cartCountBadge.style.display = "none";
      //console.log("Cart is empty, badge hidden");
    }
  }
  if (itemCountBadge) {
    if (totalItems > 0) {
      itemCountBadge.textContent = totalItems;
      itemCountBadge.style.display = "block";
    } else {
      itemCountBadge.style.display = "none";
    }
  }
}

updateCartCount();

// FETCH ALL PRODUCTS

function fetchAllProducts() {
  //console.log("Fetching all products from API");

  return fetch("https://fakestoreapi.com/products")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to fetch products: " + response.status);
      }

      //console.log("Response received, converting to JSON");
      return response.json();
    })
    .then(function (products) {
      //console.log("Received " + products.length + " products");
      return products;
    })
    .catch(function (error) {
      console.error("Error fetching products:", error);
      return [];
    });
}

// FETCH PRODUCTS BY CATEGORY

function fetchProductsByCategory(category) {
  //console.log("Fetching products for category: " + category);

  const url = "https://fakestoreapi.com/products/category/" + category;

  return fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to fetch category: " + response.status);
      }

      //console.log("Category response received");
      return response.json();
    })
    .then(function (products) {
      //console.log("Received " + products.length + " products for " + category);
      return products;
    })
    .catch(function (error) {
      console.error("Error fetching category:", error);
      return [];
    });
}

// FETCH SINGLE PRODUCT

function fetchProductById(productId) {
  //console.log("Fetching product with ID: " + productId);

  const url = "https://fakestoreapi.com/products/" + productId;

  return fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Product not found: " + response.status);
      }

      //console.log("Product response received");
      return response.json();
    })
    .then(function (product) {
      //console.log("Product loaded: " + product.title);
      return product;
    })
    .catch(function (error) {
      console.error("Error fetching product:", error);
      return null;
    });
}

// FETCH CATEGORIES LIST

function fetchCategories() {
  //console.log("Fetching categories list");

  return fetch("https://fakestoreapi.com/products/categories")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      //console.log("Categories response received");
      return response.json();
    })
    .then(function (categories) {
      //console.log("Received " + categories.length + " categories");
      return categories;
    })
    .catch(function (error) {
      console.error("Error fetching categories:", error);
      return [];
    });
}

// FORMAT PRICE

function formatPrice(price) {
  return "$" + parseFloat(price).toFixed(2);
}

// TRUNCATE TEXT

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + "...";
}

// INITIALIZE CART

const existingCart = localStorage.getItem("swiftcart");

if (!existingCart) {
  console.log("No cart found, creating new one");

  const newCart = {
    items: [],
  };

  localStorage.setItem("swiftcart", JSON.stringify(newCart));
}

// ADD ITEM TO CART

function addToCart(product) {
  //console.log("Adding to cart:", product.title);

  const cart = getCart();

  let existingItem = null;
  for (let i = 0; i < cart.items.length; i++) {
    if (cart.items[i].id === product.id) {
      existingItem = cart.items[i];
      break;
    }
  }

  if (existingItem) {
    existingItem.quantity = existingItem.quantity + 1;
    //console.log("Updated quantity for " + product.title);
  } else {
    const newItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    cart.items.push(newItem);
    //console.log("Added new item to cart");
  }

  saveCart(cart);

  alert("Added to cart!");
  updateCartCount();
}

// REMOVE ITEM FROM CART

function removeFromCart(productId) {
  //console.log("Removing item with ID: " + productId);

  const cart = getCart();

  cart.items = cart.items.filter(function (item) {
    return item.id !== productId;
  });

  saveCart(cart);

  //console.log("Item removed from cart");
  updateCartCount();
}

// UPDATE ITEM QUANTITY

function updateCartItemQuantity(productId, newQuantity) {
  //   console.log(
  //     "Updating quantity for ID " + productId + " to " + newQuantity,
  //   );

  if (newQuantity < 1) {
    //console.log("Quantity too low, removing item instead");
    removeFromCart(productId);
    return;
  }

  const cart = getCart();

  for (let i = 0; i < cart.items.length; i++) {
    if (cart.items[i].id === productId) {
      cart.items[i].quantity = newQuantity;
      //console.log("Quantity updated to " + newQuantity);
      break;
    }
  }

  saveCart(cart);
  updateCartCount();
}

// GET CART FROM STORAGE

function getCart() {
  const cartJSON = localStorage.getItem("swiftcart");

  if (!cartJSON) {
    return { items: [] };
  }

  return JSON.parse(cartJSON);
}

// SAVE CART TO STORAGE

function saveCart(cart) {
  //console.log("Saving cart to storage");

  localStorage.setItem("swiftcart", JSON.stringify(cart));

  //console.log("Cart saved with " + cart.items.length + " items");
}

// CALCULATE CART TOTAL

function calculateCartTotals() {
  //console.log("Calculating cart totals");

  const cart = getCart();

  let subtotal = 0;
  for (let i = 0; i < cart.items.length; i++) {
    const item = cart.items[i];
    subtotal = subtotal + item.price * item.quantity;
  }

  //console.log("Subtotal: $" + subtotal.toFixed(2));

  const tax = subtotal * 0.1;
  //console.log("Tax (10%): $" + tax.toFixed(2));

  const shipping = 0;

  const total = subtotal + tax + shipping;
  //console.log("Total: $" + total.toFixed(2));

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: shipping,
    total: parseFloat(total.toFixed(2)),
  };
}

// CLEAR CART

function clearCart() {
  //console.log("Clearing cart");

  const emptyCart = {
    items: [],
  };

  saveCart(emptyCart);

  //console.log("Cart cleared");

  //   if (typeof updateCartCount === "function") {
  //     updateCartCount();
  //   }
  updateCartCount();
}

// GET ITEM COUNT

function getCartItemCount() {
  const cart = getCart();

  let totalItems = 0;
  for (let i = 0; i < cart.items.length; i++) {
    totalItems = totalItems + cart.items[i].quantity;
  }

  return totalItems;
}

// LOAD TRENDING PRODUCTS

if (document.getElementById("trending-products")) {
  //console.log("Home page loaded");
  loadTrendingProducts();
}

function loadTrendingProducts() {
  //console.log("Loading trending products...");

  const trendingContainer = document.getElementById("trending-products");

  if (!trendingContainer) {
    //console.log("Trending products container not found");
    return;
  }

  trendingContainer.innerHTML =
    '<p class="text-center text-gray-500">Loading products...</p>';

  fetchAllProducts()
    .then(function (allProducts) {
      //console.log("Got " + allProducts.length + " products");

      const trendingProducts = allProducts.slice(0, 4);

      //   console.log(
      //     "Displaying " + trendingProducts.length + " trending products",
      //   );

      trendingContainer.innerHTML = "";

      trendingProducts.forEach(function (product) {
        const card = createProductCard(product);
        trendingContainer.appendChild(card);
      });
    })
    .catch(function (error) {
      //   console.error("Error loading products:", error);
      trendingContainer.innerHTML =
        '<p class="text-center text-red-500">Failed to load products. Please refresh the page.</p>';
    });
}

// CREATE PRODUCT CARD

function createProductCard(product) {
  //console.log("Creating card for: " + product.title);

  const card = document.createElement("div");
  card.className = "card bg-white shadow-md hover:shadow-lg transition h-full";

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.title;
  image.className = "w-full h-48 object-contain p-4 bg-gray-100";

  const infoDiv = document.createElement("div");
  infoDiv.className = "card-body p-4";

  const title = document.createElement("h3");
  title.className = "font-semibold text-sm mb-2";
  title.textContent = truncateText(product.title, 40);

  const price = document.createElement("p");
  price.className = "text-primary font-bold text-lg mb-3";
  price.textContent = formatPrice(product.price);

  const rating = document.createElement("div");
  rating.className = "flex items-center gap-2 text-sm text-gray-600 mb-4";
  rating.innerHTML =
    '<span class="text-yellow-400">★</span> ' +
    product.rating.rate +
    " (" +
    product.rating.count +
    ")";

  const detailsBtn = document.createElement("button");
  detailsBtn.className = "btn btn-sm md:btn-md btn-primary text-white w-full";
  detailsBtn.textContent = "View Details";

  detailsBtn.addEventListener("click", function () {
    //console.log("View details clicked for product ID: " + product.id);
    showProductModal(product);
  });

  infoDiv.appendChild(title);
  infoDiv.appendChild(price);
  infoDiv.appendChild(rating);
  infoDiv.appendChild(detailsBtn);

  card.appendChild(image);
  card.appendChild(infoDiv);

  return card;
}

// SHOW PRODUCT MODAL

function showProductModal(product) {
  //console.log("Showing modal for: " + product.title);

  const modal = document.getElementById("product-modal");

  if (!modal) {
    console.log("[v0] Modal not found");
    return;
  }

  const modalContent = document.getElementById("modal-content");

  if (!modalContent) {
    //console.log("Modal content area not found");
    return;
  }

  let modalHTML = "";
  modalHTML = modalHTML + '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
  modalHTML = modalHTML + '<div class="flex items-center justify-center">';
  modalHTML =
    modalHTML +
    '<img src="' +
    product.image +
    '" alt="' +
    product.title +
    '" class="max-w-xs h-auto">';
  modalHTML = modalHTML + "</div>";
  modalHTML = modalHTML + "<div>";
  modalHTML =
    modalHTML +
    '<h2 class="text-2xl font-bold mb-4">' +
    product.title +
    "</h2>";
  modalHTML =
    modalHTML + '<p class="text-gray-600 mb-4">' + product.description + "</p>";
  modalHTML =
    modalHTML +
    '<p class="text-3xl font-bold text-primary mb-4">' +
    formatPrice(product.price) +
    "</p>";
  modalHTML =
    modalHTML +
    '<p class="text-sm text-gray-600 mb-6">Rating: ' +
    product.rating.rate +
    "/5 (" +
    product.rating.count +
    " reviews)</p>";
  modalHTML =
    modalHTML +
    '<button class="btn btn-primary text-white w-full" onclick="addProductToCart(' +
    product.id +
    ')">Add to Cart</button>';
  modalHTML = modalHTML + "</div>";
  modalHTML = modalHTML + "</div>";

  modalContent.innerHTML = modalHTML;

  modal.showModal();

  //console.log("Modal displayed");
}

// ADD PRODUCT TO CART

function addProductToCart(productId) {
  //console.log("Adding product " + productId + " to cart");

  fetchProductById(productId).then(function (product) {
    if (product) {
      addToCart(product);

      const modal = document.getElementById("product-modal");
      if (modal) {
        modal.close();
      }
    }
  });
}

// PRODUCTS PAGE INITIALIZATION

let allProducts = [];
let currentCategory = "all";

if (document.getElementById("products-grid")) {
  //console.log("Products page loaded");

  loadAllProducts();
  setupCategoryFilters();
}

// LOAD ALL PRODUCTS

function loadAllProducts() {
  //console.log("Loading all products...");

  const productsGrid = document.getElementById("products-grid");

  if (!productsGrid) {
    //console.log("Products grid not found");
    return;
  }

  productsGrid.innerHTML =
    '<p class="col-span-full text-center text-gray-600">Loading products...</p>';

  fetchAllProducts()
    .then(function (products) {
      //console.log("Loaded " + products.length + " products");

      allProducts = products;

      displayProducts(allProducts);
    })
    .catch(function (error) {
      //console.error("Error loading products:", error);
      productsGrid.innerHTML =
        '<p class="col-span-full text-center text-red-500">Failed to load products. Please refresh the page.</p>';
    });
}

// DISPLAY PRODUCTS IN GRID

function displayProducts(products) {
  //   console.log("Displaying " + products.length + " products");

  const productsGrid = document.getElementById("products-grid");

  productsGrid.innerHTML = "";

  if (products.length === 0) {
    productsGrid.innerHTML =
      '<p class="col-span-full text-center text-gray-600">No products found.</p>';
    return;
  }

  products.forEach(function (product) {
    const card = createProductCard(product);

    productsGrid.appendChild(card);
  });
}

// SET UP CATEGORY FILTERS

function setupCategoryFilters() {
  //   console.log("Setting up category filters");

  const categoryButtons = document.querySelectorAll(".category-pill");

  if (categoryButtons.length === 0) {
    // console.log("No category buttons found");
    return;
  }

  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      //   console.log("Category button clicked");

      const selectedCategory = button.getAttribute("data-category");
      //   console.log("Selected category: " + selectedCategory);

      updateActiveButton(categoryButtons, button);

      if (selectedCategory === "all") {
        currentCategory = "all";
        displayProducts(allProducts);
      } else {
        currentCategory = selectedCategory;

        const filteredProducts = allProducts.filter(function (product) {
          return (
            product.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        });

        // console.log(
        //   "Filtered to " +
        //     filteredProducts.length +
        //     " products in " +
        //     selectedCategory,
        // );
        displayProducts(filteredProducts);
      }
    });
  });
}

// UPDATE ACTIVE BUTTON STYLE

function updateActiveButton(buttons, activeButton) {
  //   console.log("Updating active button styles");

  buttons.forEach(function (button) {
    button.style.backgroundColor = "";
    button.style.borderColor = "";
    button.style.color = "";
  });

  activeButton.style.backgroundColor = "#6366f1";
  activeButton.style.borderColor = "#6366f1";
  activeButton.style.color = "white";
}

// CART PAGE INITIALIZATION

if (
  document.getElementById("cart-items") ||
  document.getElementById("empty-cart")
) {
  // console.log("Cart page loaded");

  renderCart();
}

// RENDER CART

function renderCart() {
  //   console.log("Rendering cart...");

  const cart = getCart();

  const emptyCartMessage = document.getElementById("empty-cart");
  const cartContent = document.getElementById("cart-content");

  if (cart.items.length === 0) {
    // console.log("Cart is empty");

    if (emptyCartMessage) {
      emptyCartMessage.style.display = "block";
    }
    if (cartContent) {
      cartContent.style.display = "none";
    }
  } else {
    // console.log("Cart has " + cart.items.length + " items");

    if (emptyCartMessage) {
      emptyCartMessage.style.display = "none";
    }
    if (cartContent) {
      cartContent.style.display = "block";
    }

    displayCartItems(cart.items);

    updateOrderSummary(cart.items);
  }
}

// DISPLAY CART ITEMS

function displayCartItems(items) {
  //   console.log("Displaying " + items.length + " cart items");

  const cartItemsContainer = document.getElementById("cart-items");

  if (!cartItemsContainer) {
    // console.log("Cart items container not found");
    return;
  }

  cartItemsContainer.innerHTML = "";

  items.forEach(function (item) {
    const cartItemDiv = createCartItemElement(item);

    cartItemsContainer.appendChild(cartItemDiv);
  });
}

// CREATE CART ITEM ELEMENT

function createCartItemElement(item) {
  //   console.log("Creating cart item for: " + item.title);

  const itemDiv = document.createElement("div");
  itemDiv.className = "flex gap-4 p-6 border-b border-gray-200";

  const imageDiv = document.createElement("div");
  imageDiv.className =
    "w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0";
  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.title;
  image.className = "max-h-full object-contain";
  imageDiv.appendChild(image);

  const infoDiv = document.createElement("div");
  infoDiv.className = "flex-1";

  const title = document.createElement("h3");
  title.className = "font-semibold text-gray-800 mb-1";
  title.textContent = item.title;

  const price = document.createElement("p");
  price.className = "text-lg font-bold";
  price.style.color = "var(--primary-color)";
  price.textContent = formatPrice(item.price);

  infoDiv.appendChild(title);
  infoDiv.appendChild(price);

  const controlsDiv = document.createElement("div");
  controlsDiv.className = "flex flex-col items-end gap-2";

  const quantityDiv = document.createElement("div");
  quantityDiv.className =
    "flex items-center gap-2 border border-gray-300 rounded";

  const decreaseBtn = document.createElement("button");
  decreaseBtn.textContent = "-";
  decreaseBtn.className = "px-3 py-1 hover:bg-gray-100";
  decreaseBtn.addEventListener("click", function () {
    // console.log("Decrease quantity for item " + item.id);
    updateCartItemQuantity(item.id, item.quantity - 1);
    renderCart();
  });

  const qtyDisplay = document.createElement("span");
  qtyDisplay.textContent = item.quantity;
  qtyDisplay.className = "px-3 py-1 border-l border-r border-gray-300";

  const increaseBtn = document.createElement("button");
  increaseBtn.textContent = "+";
  increaseBtn.className = "px-3 py-1 hover:bg-gray-100";
  increaseBtn.addEventListener("click", function () {
    // console.log("Increase quantity for item " + item.id);
    updateCartItemQuantity(item.id, item.quantity + 1);
    renderCart();
  });

  quantityDiv.appendChild(decreaseBtn);
  quantityDiv.appendChild(qtyDisplay);
  quantityDiv.appendChild(increaseBtn);

  const itemSubtotal = document.createElement("p");
  itemSubtotal.className = "font-semibold text-gray-800";
  itemSubtotal.textContent = formatPrice(item.price * item.quantity);

  const removeBtn = document.createElement("button");
  removeBtn.className = "text-red-500 hover:text-red-700 text-sm";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", function () {
    // console.log("Remove item " + item.id + " from cart");
    removeFromCart(item.id);
    renderCart();
  });

  controlsDiv.appendChild(quantityDiv);
  controlsDiv.appendChild(itemSubtotal);
  controlsDiv.appendChild(removeBtn);

  itemDiv.appendChild(imageDiv);
  itemDiv.appendChild(infoDiv);
  itemDiv.appendChild(controlsDiv);

  return itemDiv;
}
