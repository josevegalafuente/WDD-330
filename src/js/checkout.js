import ProductData from "./ProductData.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

const dataSource = new ProductData();
const checkout = new CheckoutProcess("so-cart", ".order-summary", dataSource);

checkout.init();

document.querySelector("#checkout").addEventListener("submit", (event) => {
  event.preventDefault();

  checkout.checkout(event.target);
});
