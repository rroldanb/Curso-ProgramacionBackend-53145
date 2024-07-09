const { ticketModel } = require("./models/tickets.model.js");

class TicketDaoMongo {
  constructor() {
    this.ticketModel = ticketModel;
  }


  async createTicket(ticket) {
    return await this.ticketModel.create(ticket);
  }

  async getTicketsBy(filter) {
    return await this.ticketModel.findOne({filter});
  }

  async getTicketsByEmail(email) {
    const tickets = await this.ticketModel.find({purchaser: email});
    return tickets
  }

}

module.exports = TicketDaoMongo;


