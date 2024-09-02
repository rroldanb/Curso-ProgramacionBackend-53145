
class TicketRepository {
  constructor(TicketDao) {
    this.ticketDao = TicketDao;
  }
  
  createTicket = async (ticket) =>{
    return await this.ticketDao.createTicket(ticket);
  }

  getTicketsBy = async (filter)=>{
    return await this.ticketDao.getTicketsBy(filter)
  }

  getTicketBy = async (filter) =>{
    return await this.ticketDao.getTicketBy(filter);
  }

  deleteTicket = async (ticket) =>{
    const result = await this.ticketDao.deleteTicket({ _id: ticket });
    return result;
  }
  
}

module.exports = TicketRepository;
