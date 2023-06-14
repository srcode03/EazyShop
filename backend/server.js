const app = require('./app');
const dotenv= require('dotenv');
const connectDB = require('./config/database');
// handling uncaught exception
process.on('uncaughtException',(err)=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down the server due to uncaught Exception");
    process.exit(1);
})
// config
dotenv.config({path:'../backend/config/config.env'}); 
// connect to database
connectDB()
const port=4000
const server = app.listen(port,()=>{
    console.log(`Server is listening on ${port}`);
});

// unhandled Promise rejection

process.on('unhandledRejection',(err)=>{
    console.log(`Error:${err.message}`)
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(()=>{
        process.exit(1);
    });
});