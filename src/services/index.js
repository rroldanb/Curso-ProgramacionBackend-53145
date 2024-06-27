const CartsManager = require("../dao/CartsMongo.manager");
const ProductsManager = require("../dao/ProductsMongo.manager");
const SessionsService = require("../dao/SessionsManager");
const { UsersManagerMongo } = require("../dao/UsersManager");

module.exports = {
    ProductsService: ProductsManager,
    CartsService: CartsManager, 
    UsersService: UsersManagerMongo,
    SessionsService,
};