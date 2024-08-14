const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de mi ecommerce", () => {
  before(async function () {
    const loginCredentials = {
      email: "adminCoder@coder.com",
      password: "adminCod3r123",
    };
    const { headers } = await requester
      .post("/api/sessions/login")
      .send(loginCredentials);
    this.cookie = headers["set-cookie"][0];
  });

  describe("Test de producto", () => {
    it("El endpoint GET /api/products debe devolver los 10 primeros productos", async () => {
      const { statusCode, ok, _body } = await requester.get("/api/products");
      expect(ok).to.be.equal(true);
      expect(statusCode).to.be.equal(200);
      expect(_body.payload).to.be.an("array").that.has.lengthOf.at.most(10);
    });
    it("El usuario admin debe poder agregar un producto a la base de datos", async function () {
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
      const { statusCode, _body } = await requester
        .post("/api/products")
        .set("Cookie", this.cookie)
        .send(mockProduct);
      expect(statusCode).to.be.equal(201);
      expect(_body.payload.code).to.be.equal("NP1234");

      this.pid = _body.payload._id;
    });
    it("El usuario admin debe poder eliminar un producto a la base de datos", async function () {
      const { statusCode } = await requester
        .delete(`/api/products/${this.pid}`)
        .set("Cookie", this.cookie);

      expect(statusCode).to.be.equal(200);
    });
  });

  describe("Test de Sessions", () => {
    before(function () {
      this.cookie = null;
    });

    it("El usuario debería poder loguearse y recibir una cookie de sesión", async () => {
      const loginCredentials = {
        email: "test.user@mail.com",
        password: "123456",
      };

      const { statusCode, headers } = await requester
        .post("/api/sessions/login")
        .send(loginCredentials);

      expect(statusCode).to.be.equal(200);
      expect(headers).to.have.property("set-cookie");

      this.cookie = headers["set-cookie"][0];
      expect(this.cookie).to.include("connect.sid");
    });
    it("El usuario logueado debería poder acceder a un recurso protegido después de logout", async () => {
      const { statusCode } = await requester
        .get("/api/sessions/current")
        .set("Cookie", this.cookie);

      expect(statusCode).to.be.equal(200);
    });
    it("El usuario debería poder desloguearse y ser redirigido", async () => {
      const { statusCode, headers } = await requester
        .get("/api/sessions/logout")
        .set("Cookie", this.cookie);

      expect(statusCode).to.be.equal(302);
      expect(headers).to.have.property("location", "/");
    });

    it("El usuario deslogueado no debería poder acceder a un recurso protegido después de logout", async () => {
      const { statusCode } = await requester
        .get("/api/sessions/current")
        .set("Cookie", this.cookie);

      expect(statusCode).to.be.equal(401);
    });
  });

  describe("Test de Carrito de Compras", () => {
    before(async function () {
      const loginCredentials = {
        email: "test.user@mail.com",
        password: "123456",
      };

      const { headers } = await requester
        .post("/api/sessions/login")
        .send(loginCredentials);

      this.cookie = headers["set-cookie"][0];
      this.cid = "66bc3116c4aec07175704e77";
    });

    it("El usuario debería poder agregar dos productos distintos al carrito y recibir una confirmación de que fueron agregados con éxito", async function () {
      const {
        _body: { payload: products },
      } = await requester.get("/api/products").set("Cookie", this.cookie);

      const randomProducts = [];
      while (randomProducts.length < 2) {
        const randomProduct =
          products[Math.floor(Math.random() * products.length)];
        if (!randomProducts.includes(randomProduct)) {
          randomProducts.push(randomProduct);
        }
      }

      const firstPid = randomProducts[0]._id;
      const firstResponse = await requester
        .post(`/api/carts/${this.cid}/product/${firstPid}`)
        .set("Cookie", this.cookie);

      expect(firstResponse.statusCode).to.be.equal(200);
      expect(firstResponse._body.message).to.be.equal(
        `Producto con pid ${firstPid} agregado con éxito al carrito ${this.cid}`
      );

      const secondPid = randomProducts[1]._id;
      const secondResponse = await requester
        .post(`/api/carts/${this.cid}/product/${secondPid}`)
        .set("Cookie", this.cookie);

      expect(secondResponse.statusCode).to.be.equal(200);
      expect(secondResponse._body.message).to.be.equal(
        `Producto con pid ${secondPid} agregado con éxito al carrito ${this.cid}`
      );

      this.pid = firstPid;
    });

    it("El usuario debería poder ver el estado actual del carrito conteniendo un array de productos con al menos el producto agregado en el test anterior", async function () {
      const { statusCode, _body } = await requester
        .get(`/api/carts/${this.cid}`)
        .set("Cookie", this.cookie);

      expect(statusCode).to.be.equal(200);
      expect(_body).to.have.property("products");
      expect(_body.products).to.be.an("array");
      expect(_body.products.length).to.be.greaterThan(0);
    });

    it("El usuario debería poder eliminar un producto del carrito y recibir la confirmacion con el product id y el cart id", async function () {
      const { statusCode, _body } = await requester
        .delete(`/api/carts/${this.cid}/product/${this.pid}`)
        .set("Cookie", this.cookie);

      expect(statusCode).to.be.equal(200);
      expect(_body.message).to.be.equal(
        `Producto con pid ${this.pid} eliminado del carrito ${this.cid}.`
      );
    });

    it("El usuario debería poder vaciar el carrito y recibir el mensaje 'Carrito vaciado correctamente'", async function () {
      const { statusCode, _body } = await requester
        .delete(`/api/carts/${this.cid}`)
        .set("Cookie", this.cookie);
      expect(_body.message).to.be.equal("Carrito vaciado correctamente");
      expect(statusCode).to.be.equal(200);
    });
  });
});
