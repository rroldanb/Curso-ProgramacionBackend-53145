const { Schema, model } = require("mongoose");

const cartCollection = 'carts';

const cartItemSchema = new Schema({
    pid: { type: Schema.Types.ObjectId, ref: 'products', required: false }, 
    quantity: { type: Number, required: false }
});

const cartSchema = new Schema({
//    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    products: [cartItemSchema],
});


exports.cartsModel = model(cartCollection, cartSchema);
