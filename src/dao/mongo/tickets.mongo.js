const { ticketModel } = require("./models/tickets.model.js");

class TicketDaoMongo {
  constructor() {
    this.ticketModel = ticketModel;
  }
  
  createTicket = async (ticket) =>{
    return await this.ticketModel.create(ticket);
  }

  getTicketsBy = async (filter) =>{
    return await this.ticketModel.find(filter);
  }

  getTicketBy = async (filter) =>{
    return await this.ticketModel.findOne(filter);
  }

  deleteTicket = async (ticket) =>{
    return await this.ticketModel.deleteOne({ _id: ticket });
  }
  
}

module.exports = TicketDaoMongo;


