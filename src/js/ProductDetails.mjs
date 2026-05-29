import { getLocalStorage, setLocalStorage } from "/js/utils.mjs";

function getImageUrl(product) {
  const image =
    product.Image ||
    product.Images?.PrimaryExtraLarge ||
    product.Images?.PrimaryLarge ||
    product.Images?.PrimaryMedium;

  if (!image) {
    return "";
  }

  if (image.startsWith("http") || image.startsWith("/")) {
    return image;
  }

  return `/${image.replace(/^(\.\/|\.\.\/)+/, "")}`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      console.error(`Product not found for ID: ${this.productId}`);
      return;
    }

    this.renderProductDetails();

    const addToCartButton =
      document.getElementById("addToCart") ||
      document.getElementById("add-to-cart");

    addToCartButton.addEventListener(
      "click",
      this.addProductToCart.bind(this),
    );
  }

  addProductToCart() {
    let cartItems = getLocalStorage("so-cart") || [];

    if (!Array.isArray(cartItems)) {
      cartItems = [cartItems];
    }

    cartItems.push(this.product);

    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    const brandElement =
      document.getElementById("product-brand") ||
      document.getElementById("p-brand");

    const nameElement =
      document.getElementById("product-name") ||
      document.getElementById("p-name");

    const imageElement =
      document.getElementById("product-image") ||
      document.getElementById("p-image");

    const priceElement =
      document.getElementById("product-price") ||
      document.getElementById("p-price");

    const colorElement =
      document.getElementById("product-color") ||
      document.getElementById("p-color");

    const descriptionElement =
      document.getElementById("product-description") ||
      document.getElementById("p-description");

    const addToCartButton =
      document.getElementById("addToCart") ||
      document.getElementById("add-to-cart");

    brandElement.textContent =
      typeof this.product.Brand === "string"
        ? this.product.Brand
        : this.product.Brand?.Name;

    nameElement.textContent = this.product.NameWithoutBrand;

    imageElement.src = getImageUrl(this.product);
    imageElement.alt = this.product.NameWithoutBrand;

    priceElement.textContent = `$${this.product.FinalPrice}`;

    colorElement.textContent = this.product.Colors?.[0]?.ColorName || "";

    descriptionElement.innerHTML = this.product.DescriptionHtmlSimple;

    addToCartButton.dataset.id = this.product.Id;
  }
}