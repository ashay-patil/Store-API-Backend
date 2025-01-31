require('dotenv').config();
require('express-async-errors');         //This package handles the mongoDB error int the controllers so that we explecitly dont have to setup our async-wrapper middleware


const express = require('express');
const app = express();
const connectDB = require('./db/connect');   //for connecting to the database
const productsRouter = require('./routes/products');


//Importing the Middlewares
const notFountMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');



// Inbuilt Middleware for Decoding the post request body
app.use(express.json());



//Routes
app.use('/api/v1/products',productsRouter);


app.get('/', (req,res)=>{
    res.status(200).send('<h1>Store API</h1><a href="/api/v1/products">Products Route</a>');
});


//Products Routes




//Using the Imported Middleware
app.use(errorMiddleware);
app.all('/*', notFountMiddleware);


//Connecting the DataBase and strating the Server
const port = process.env.PORT || 3000;
const start = (async () =>{
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to the DB');
        app.listen(port, ()=>{console.log(`Server Listening on port ${port}`);});
    } catch (error) {
        console.log('Could not connect to the database');
    }
})();   //IIFE function




/*
General setup of every app.js file :- 
    1. Import Modules
    2. Use express.json() middleware for decoding the post request body
    3. Use express.static middleware for connecting the frontend
    4. Setup all the routes
    5. Use error handler Middleware
    6. Use app.all('/*',notfound) for handling the not found routes
    7. Connect the DB and start server;
*/
