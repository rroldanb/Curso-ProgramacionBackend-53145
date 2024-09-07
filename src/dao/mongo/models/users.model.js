const { Schema, model } = require("mongoose");
const mongoosePaginate = require ("mongoose-paginate-v2")

const userCollection = 'users';

const documentItemSchema = new Schema({
    name: { type: String, required: true }, 
    reference: { type: String, required: true }
});
const UserSchema = new Schema({
    full_name: String,
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    birthDate: Date,
    password: String,
    role: {
        type: String,
        enum: ['user', 'premium', 'admin'],
        default: 'user'
    },
    cart_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'carts', 
        required: true 
    },
    documents: [documentItemSchema],
    last_connection: Date,
    resetPasswordToken: String, 
    resetPasswordExpires: Date  
});
UserSchema.plugin(mongoosePaginate)

exports.usersModel = model(userCollection, UserSchema);

