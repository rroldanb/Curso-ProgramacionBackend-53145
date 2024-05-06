const { connect } = require('mongoose')

exports.connectDB=()=>{
    connect(
    "mongodb+srv://gago:Larrucita2@cluster0.8ltmgp5.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("base de datos conectada");
}