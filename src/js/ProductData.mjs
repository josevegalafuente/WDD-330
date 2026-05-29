const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
  }
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);

    return data.Result;
  }

  async findProductById(id) {
    const products = await this.getData(this.category);
    return products.find((item) => item.Id === id);
  }
}