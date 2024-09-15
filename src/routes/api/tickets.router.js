const { Router } = require("express");

const {TicketsController} = require("../../controllers/tickets.controller");
const { authorization } = require('../../middlewares/auth.middleware');

const {getUserTickets, getUserTicket} = new TicketsController()
const ticketsRouter = Router();


ticketsRouter.get("/", authorization(['user', 'premium']), getUserTickets);
ticketsRouter.get("/:tid", authorization(['user', 'premium']), getUserTicket);

module.exports = ticketsRouter;


