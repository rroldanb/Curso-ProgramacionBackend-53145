const ProductDaoMongo = require("../src/dao/mongo/products.mongo");
const Assert = require("assert");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/testdata");
// mongoose.connect(process.env.MONGO_URL)
const assert = Assert.strict;

describe("Test de productos en el Dao", () => {
  before(function () {
    this.productDao = new ProductDaoMongo();
  });
  beforeEach(async function () {
    await mongoose.connection.collections.products.drop().catch(() => {});

    this.timeout(500);
  });
  it("El dao debe ontener los productos en formato arreglo", async function () {
    // console.log(this.productDao)
    const result = await this.productDao.getProducts(); //-> get
    assert.strictEqual(Array.isArray(result.docs), true);
  });
  it("El dao debe agregar un producto a la base de datos", async function () {
    let mockProduct = {
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto",
      code: "NP1234",
      price: 49.99,
      status: true,
      stock: 100,
      category: "Juguetes",
      thumbnails: [
        "/images/producto-prueba_03_imagen_1.jpg",
        "/images/producto-prueba_03_imagen_2.jpg",
      ],
    };
    const result = await this.productDao.addProduct(mockProduct); //->save
    // console.log('RRresult', result)
    // assert.ok(result._id);
    assert.deepStrictEqual(result.title, "Nuevo Producto" )
  });

it ('El dao puede buscar un producto por su id', async function () {
    let mockProduct = {
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto",
      code: "NP1234",
      price: 49.99,
      status: true,
      stock: 100,
      category: "Juguetes",
      thumbnails: [
        "/images/producto-prueba_03_imagen_1.jpg",
        "/images/producto-prueba_03_imagen_2.jpg",
      ],
    };
    const result = await this.productDao.addProduct(mockProduct); //->save
    const pid = result._id
    const product = await this.productDao.getProductById(pid) //->getBy
    // assert.ok(product._id)
    assert.strict(typeof product, 'object')
});


after(function () {
    mongoose.disconnect();
    setTimeout(() => process.exit(), 100);
  });

});
