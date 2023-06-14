const mongoose = require ('mongoose');
const connectDB= ()=>{
    mongoose.connect('mongodb://0.0.0.0:27017/Ecommerce',{
    useNewUrlParser: true 
}).then((data)=>{
    console.log(`Mongodb connected with server`)
})
}
module.exports= connectDB;