const { Schema, model } = require("mongoose");
const mongoosePaginate = require ("mongoose-paginate-v2")

const userCollection = 'users';
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
    password: String,
    role: {
        type: String,
        enum: ['user', 'user_premium', 'admin'],
        default: 'user'
    },
    cart_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'carts', 
        required: true 
    }
});
UserSchema.plugin(mongoosePaginate)

exports.usersModel = model(userCollection, UserSchema);

