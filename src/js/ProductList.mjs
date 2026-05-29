export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(productList) {
    const htmlItems = productList.map((product) =>
      productCardTemplate(product, this.category),
    );

    this.listElement.innerHTML = htmlItems.join("");
  }
}

function productCardTemplate(product, category) {
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}&category=${category}">
      <img
        src="${product.Images.PrimaryMedium}"
        alt="${product.NameWithoutBrand}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}