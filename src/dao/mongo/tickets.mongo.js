const { ticketModel } = require("./models/tickets.model.js");

class TicketDaoMongo {
  constructor() {
    this.ticketModel = ticketModel;
  }
  async createTicket(ticket) {
    const result =  await this.ticketModel.create(ticket);
    return result
  }

  async getTickets() {
    return await this.ticketModel.find();
  }
  
  async getTicketBy(filter) {
    return await this.ticketModel.findOne(filter);
  }

  async getTicketsByEmail(email) {
    const tickets = await this.ticketModel.find({purchaser: email});
    return tickets
  }
  
  async delete(ticket) {
    const result = await this.ticketModel.deleteOne({ _id: ticket });
    return result;
  }
  


}

module.exports = TicketDaoMongo;


