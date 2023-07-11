const { MongoClient } = require("mongodb");
const mongodbUrlString = "mongodb://localhost:27017";
const MongoDbClient = new MongoClient(mongodbUrlString);
const { Errorlogger} = require("./../middleware/logger");

const connect = async ()=> {
    try{
        await MongoDbClient.connect();
        console.log("connected to mongoDB");
    }catch(error){
        Errorlogger(error.stack.toString());
        console.error(error);
    }
}

module.exports = {
    mongoconnect: connect,
    mongodbUrlString:mongodbUrlString,
    MongoDbClient:MongoDbClient
}