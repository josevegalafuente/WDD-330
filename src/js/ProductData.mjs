const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    data = {
      message: response.statusText || "There was a problem with the request.",
    };
  }

  if (response.ok) {
    return data;
  }

  const error = new Error(
    data.message || data.Message || "There was a problem with the request.",
  );

  error.name = "servicesError";
  error.details = data;

  throw error;
}

export default class ProductData {
  constructor(category = "") {
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

  async checkout(order) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    };

    const response = await fetch(`${baseURL}checkout/`, options);
    const data = await convertToJson(response);

    return data;
  }
}