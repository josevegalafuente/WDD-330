import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
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
    document.getElementById("product-brand").textContent =
      this.product.Brand.Name;

    document.getElementById("product-name").textContent =
      this.product.NameWithoutBrand;

    const productImage = document.getElementById("product-image");
    productImage.src = this.product.Image;
    productImage.alt = this.product.NameWithoutBrand;

    document.getElementById(
      "product-price",
    ).textContent = `$${this.product.FinalPrice}`;

    document.getElementById("product-color").textContent =
      this.product.Colors[0].ColorName;

    document.getElementById("product-description").innerHTML =
      this.product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = this.product.Id;
  }
}