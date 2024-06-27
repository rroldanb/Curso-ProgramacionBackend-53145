const CartsManager = require("../dao/CartsMongo.manager");
const ProductsManager = require("../dao/ProductsMongo.manager");
const { UsersManagerMongo } = require("../dao/UsersManager");

module.exports = {
    ProductsService: ProductsManager,
    CartsService: CartsManager, 
    UsersService: UsersManagerMongo
};