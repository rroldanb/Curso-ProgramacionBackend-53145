const { Schema, model } = require("mongoose");
const mongoosePaginate = require ("mongoose-paginate-v2")

const productCollection = 'products';

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true , unique: true},
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], required: false } 
});

ProductSchema.plugin(mongoosePaginate)

exports.productsModel =  model(productCollection, ProductSchema)

