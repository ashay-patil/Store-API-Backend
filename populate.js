require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./products.json')



const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to DB');
        await Product.deleteMany();
        console.log('Currect documents removed');
        await Product.create(jsonProducts);
        console.log('Success !!.. Products added ..');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();