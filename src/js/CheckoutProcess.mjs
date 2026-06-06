import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector, dataSource) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.dataSource = dataSource;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
    this.calculateOrderTotal();
    this.displayOrderTotals();
  }

  calculateItemSummary() {
    this.itemTotal = this.list.reduce(
      (total, item) => total + Number(item.FinalPrice),
      0,
    );
  }

  calculateOrderTotal() {
    const numberOfItems = this.list.length;

    if (numberOfItems > 0) {
      this.shipping = 10 + (numberOfItems - 1) * 2;
    } else {
      this.shipping = 0;
    }

    this.tax = this.itemTotal * 0.06;
    this.orderTotal = this.itemTotal + this.shipping + this.tax;
  }

  displayOrderTotals() {
    document.querySelector("#num-items").textContent = this.list.length;
    document.querySelector("#subtotal").textContent =
      `$${this.itemTotal.toFixed(2)}`;
    document.querySelector("#tax").textContent = `$${this.tax.toFixed(2)}`;
    document.querySelector("#shipping").textContent =
      `$${this.shipping.toFixed(2)}`;
    document.querySelector("#order-total").textContent =
      `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems() {
    return this.list.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: 1,
    }));
  }

  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach((value, key) => {
      convertedJSON[key] = value;
    });

    return convertedJSON;
  }

  async checkout(formElement) {
    const order = this.formDataToJSON(formElement);

    order.orderDate = new Date().toISOString();
    order.items = this.packageItems();
    order.itemTotal = Number(this.itemTotal.toFixed(2));
    order.shipping = Number(this.shipping.toFixed(2));
    order.tax = Number(this.tax.toFixed(2));
    order.orderTotal = Number(this.orderTotal.toFixed(2));

    const response = await this.dataSource.checkout(order);

    console.log("Order submitted successfully:", response);

    setLocalStorage(this.key, []);
    formElement.reset();

    window.location.href = "../cart/index.html";
  }
}