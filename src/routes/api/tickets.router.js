const { Router } = require("express");

const {TicketsController} = require("../../controllers/tickets.controller");
const { authorization } = require('../../middlewares/auth.middleware');

const {getUserTickets} = new TicketsController()
const ticketsRouter = Router();


ticketsRouter.get("/", authorization(['user']), getUserTickets);

module.exports = ticketsRouter;


