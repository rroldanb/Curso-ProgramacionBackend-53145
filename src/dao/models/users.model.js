const { Schema, model } = require("mongoose");
// const mongoosePaginate = require ("mongoose-paginate-v2")


const userCollection = 'users'
const userSchema = new Schema ({
    first_name: String,
    last_name: String,
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: String,
    role: {
        type: String,
        default: 'user'
    }
})

// userSchema.plugin(mongoosePaginate)
exports.userModel = model(userCollection, userSchema)