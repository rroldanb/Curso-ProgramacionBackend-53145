
class TicketRepository {
  constructor(TicketDao) {
    this.ticketDao = TicketDao;
  }
  async createTicket(ticket) {
    return await this.ticketDao.createTicket(ticket);
  }

  async getTickets() {
    return await this.ticketDao.getTickets();
  }
  async getTicketsBy(filter){
    return await this.ticketDao.getTicketBy(filter)
  }

  async getTicketsByEmail(email) {
    return await this.ticketDao.getTicketsByEmail( email);
  }

  async delete(ticket) {
    const result = await this.ticketDao.deleteOne({ _id: ticket });
    return result;
  }
  
}

module.exports = TicketRepository;
