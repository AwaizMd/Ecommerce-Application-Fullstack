const app = require('./app');
const dotenv = require("dotenv");
const connectDatabase = require('./config/database'); //should be done after dotenv.config

//2.Handling uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught Exception.`);
    process.exit(1);
})

//config
dotenv.config({path:"backend/config/config.env"})

//Connecting to database
connectDatabase();

const server =app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

// console.log(youtube);  //shutting down the server due to uncaught Exception.[nodemon] app crashed - waiting for file changes before starting..

//1.unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled Promise rejection.`);
    server.close(()=>{
        process.exit(1);
    })
})
