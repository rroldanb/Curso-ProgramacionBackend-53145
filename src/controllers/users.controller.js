const {
    UsersService,
    CartsService
  } = require("../service/index");
  
  class CartsController {
    constructor() {
        this.usersService = new UsersService();
        this.cartsService = new CartsService();
    }
}