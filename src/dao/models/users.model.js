const {Schema} = require ('mongoose')

const userCollection = 'users'
const userSchema = new Schema ({
    first_name: String,
    last_name: String,
    email: {
        type:String,
        required:true,
        unique:true
    }
})

module.exports ( userModel(userCollection, userSchema))