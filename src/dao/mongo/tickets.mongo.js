const { ticketModel } = require("./models/tickets.model.js");

class TicketDaoMongo {
  constructor() {
    this.ticketModel = ticketModel;
  }
  createTicket = async (ticket) =>{
    const result =  await this.ticketModel.create(ticket);
    return result
  }

  getTickets = async () =>{
    return await this.ticketModel.find();
  }
  
  getTicketBy = async (filter) =>{
    return await this.ticketModel.findOne(filter);
  }

  getTicketsByEmail = async (email) =>{
    const tickets = await this.ticketModel.find({purchaser: email});
    return tickets
  }
  
  delete = async (ticket) =>{
    const result = await this.ticketModel.deleteOne({ _id: ticket });
    return result;
  }
  


}

module.exports = TicketDaoMongo;


