const { Schema, model } = require("mongoose");

const cartCollection = 'carts';

const cartItemSchema = new Schema({
    pid: { type: Schema.Types.ObjectId, ref: 'products', required: false }, 
    quantity: { type: Number, required: false }
});

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    products: [cartItemSchema],
});

CartSchema.pre('find', function() {
    this.populate('products.pid')
})
CartSchema.pre('findOne', function() {
    this.populate('products.pid')
})
CartSchema.pre('findById', function() {
    this.populate('products.pid')
})
exports.cartsModel = model(cartCollection, CartSchema);
