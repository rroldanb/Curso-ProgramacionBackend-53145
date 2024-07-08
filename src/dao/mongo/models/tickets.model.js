// tickets.model.js
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ticketCollection = 'tickets';

const ticketItemSchema = new Schema({
    pid: { type: Schema.Types.ObjectId, ref: 'products', required: false },
    quantity: { type: Number, required: false }
});

const TicketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase: [ticketItemSchema],
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
});

// ticketSchema.pre('find', function() {
//     this.populate('products.pid')
// })
// ticketSchema.pre('findOne', function() {
//     this.populate('products.pid')
// })
// ticketSchema.pre('findById', function() {
//     this.populate('products.pid')
// })

TicketSchema.plugin(mongoosePaginate);

const ticketModel = model(ticketCollection, TicketSchema);

module.exports = { ticketModel };
