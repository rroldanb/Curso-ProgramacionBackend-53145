const {
  ProductDao,
  SessionDao,
  UserDao,
  CartDao,
  TicketDao,
} = require("../dao/factory.js");

const ProductRepository = require("../repositories/products.repository.js");
const CartRepository = require("../repositories/carts.repository.js");
const SessionRepository = require("../repositories/sessions.repository.js");
const UserRepository = require("../repositories/users.repository.js");
const TicketRepository = require("../repositories/tickets.repository.js");

const ProductsService = new ProductRepository(new ProductDao());
const CartsService = new CartRepository(new CartDao());
const SessionsService = new SessionRepository(new SessionDao());
const UsersService = new UserRepository(new UserDao());
const TicketsService = new TicketRepository(new TicketDao());

module.exports = {
  ProductsService,
  CartsService,
  UsersService,
  SessionsService,
  TicketsService,
};
