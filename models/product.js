const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required :[true,'Product name must be provided']
    },
    price:{
        type:Number,
        required : [true,'Product price must be provided']
    },
    featured :{
        type : Boolean,
        default : false
    },
    rating : {
        type : Number,
        default : 4.5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    company : {
        type : String,
        enum : {
            values : ['ikea','liddy','caressa','marcos'],
            message : '{VALUE} is not supported'
        }
        // enum : ['ikea','liddy','caressa','marcos'],   enum ensures that the company name are only the values specified in the array
    }
});


module.exports = mongoose.model('Product', productSchema);  // In the database 'products' collection will be created