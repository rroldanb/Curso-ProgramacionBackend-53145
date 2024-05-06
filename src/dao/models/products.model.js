const { Schema, model } = require("mongoose");

const productCollection = 'products';

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true , unique: true},
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], required: false } 
});

exports.productsModel =  model(productCollection, productSchema)


