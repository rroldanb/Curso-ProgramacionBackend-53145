const  {persistence, connectDB} = require('../config/config.js')

let ProductDao
let UserDao
let SessionDao
let CartDao
let TicketDao

switch (persistence) {

    case 'MEMORY':
        // const UserDaoMemory = require('./memory/user.memory.js')
        // UserDao = UserDaoMemory
        break;
    case 'ARCHIVO':
        
        break;

    default:
        connectDB() 
        const ProductDaoMongo = require('./mongo/products.mongo.js')
        ProductDao = ProductDaoMongo

        const UserDaoMongo = require('./mongo/users.mongo.js')
        UserDao = UserDaoMongo

        const SessionDaoMongo = require('./mongo/sessions.mongo.js')
        SessionDao = SessionDaoMongo

        const CartDaoMongo = require('./mongo/carts.mongo.js')
        CartDao = CartDaoMongo
        
        const TicketDaoMongo = require('./mongo/tickets.mongo.js')
        TicketDao = TicketDaoMongo
        break;
}

module.exports = {
    ProductDao,
    SessionDao,
    UserDao,
    CartDao,
    TicketDao
}