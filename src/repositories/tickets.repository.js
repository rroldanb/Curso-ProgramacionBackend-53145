
class TicketRepository {
  constructor(TicketDao) {
    this.ticketDao = TicketDao;
  }
  async getTickets() {
    return await this.ticketDao.get();
  }
  async getTicketsBy(filter){
    return await this.ticketDao.getTicketBy(filter)
  }

  async getTicketsByEmail(email) {
    return await this.ticketDao.getTicketsByEmail( email);
  }

  async createTicket(ticket) {
    return await this.ticketDao.createTicket(ticket);
  }
}

module.exports = TicketRepository;
