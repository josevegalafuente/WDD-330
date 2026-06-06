import { getLocalStorage } from "./utils.mjs";

function getImageUrl(product) {
  const image =
    product.Image ||
    product.Images?.PrimaryMedium ||
    product.Images?.PrimaryLarge ||
    product.Images?.PrimaryExtraLarge ||
    product.Images?.PrimarySmall;

  if (!image) {
    return "";
  }

  if (image.startsWith("http") || image.startsWith("/")) {
    return image;
  }

  return `/${image.replace(/^(\.\/|\.\.\/)+/, "")}`;
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${getImageUrl(item)}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;

  return newItem;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");
  const checkoutButton = document.querySelector(".checkout-button");

  if (cartItems.length === 0) {
    productList.innerHTML = `<li class="empty-cart">Your cart is empty.</li>`;

    if (checkoutButton) {
      checkoutButton.style.display = "none";
    }

    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  productList.innerHTML = htmlItems.join("");

  if (checkoutButton) {
    checkoutButton.style.display = "inline-block";
  }
}

renderCartContents();
