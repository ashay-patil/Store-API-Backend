// Get the model
const Product = require('../models/product');

// When executing a query, you specify your query as a JSON document. The JSON document's syntax is the same as the MongoDB shell.  -- Mongoose Docs


// In the below controllers we dont need to explicitly setup try-catch asyncWrapper middleware to execute mongoDB queries because the errors are send to our error handling middleware by the express-async-errors package


const getAllProductsStatic = async (req,res)=>{
    const products = await Product.find({name : 'vase table'});
    res.status(200).json({products, nbHits : products.length});
}

const getAllProducts = async (req,res) =>{
    const {featured,company,name,sort,fields,page,limit,numericFilters} = req.query;
    const queryObject = {};
    if(featured) queryObject.featured = featured === 'true' ? true : false;
    if(company) queryObject.company = company;
    if(name) queryObject.name = { $regex : name , $options :'i'};
    if(numericFilters){
        const operatorMap ={
            '>':'$gt' , '>=':'$gte' , '=' : '$eq' , '<': '$lt', '<=':'$lte'
        };
        /*
        This is a mapping of human-readable comparison operators (>, >=, =, etc.) to MongoDB query operators:
            > becomes $gt (greater than)
            >= becomes $gte (greater than or equal to)
            = becomes $eq (equal)
            < becomes $lt (less than)
            <= becomes $lte (less than or equal to)
        */
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;       // A regular expression (RegEx) is a pattern used to search, match, or replace text in a string
        /*
            / ... / → Defines a regular expression.
            \b → Word boundary, ensuring the match is a separate token (not part of another word).
            (<|>|>=|=|<|<=) → Capturing group, meaning it will match any of these operators: >, >=, =, <, <=.
            \b → Ensures it’s a separate token again.
            g → Global flag, meaning it will find all occurrences in the string.
            This regular expression helps us find and replace operators (>, >=, etc.) in the numericFilters string.
        */
        const numericFields = ['price','rating'];
        let filters = numericFilters.replace(regEx, (match)=>`-${operatorMap[match]}-`);
        filters.split(',').forEach((item)=>{
            const [field, operator, value] = item.split('-');
            if(numericFields.includes(field)){
                queryObject[field] = {[operator] : Number(value)};

                /*
                    Why [operator] instead of operator?
                        [operator] dynamically sets the key inside an object.
                        If we used just operator, it would create a fixed key "operator" instead of using "$gt", "$lte", etc.
                */
            }
        });
    }
    let result = Product.find(queryObject);
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    }
    if(fields){
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }
    if(page && limit){
        const pageNum = Number(page);
        const limitNum = Number(limit);
        let skip;
        if(pageNum>=1 && limitNum > 0)skip = (pageNum-1)*limitNum;
        result = result.skip(skip).limit(limitNum);
    }
    const products = await result;
    res.status(200).json({products, nbHits : products.length});
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
};