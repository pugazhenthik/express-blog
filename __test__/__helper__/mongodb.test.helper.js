const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;
let mongooseConnection;

const connect = async () => {
    if (!mongooseConnection) {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongooseConnection = await mongoose.connect(uri);
    }
    return mongooseConnection;
};

const disconnect = async () => {
    if (mongooseConnection) {
        await mongooseConnection.disconnect();
        await mongod.stop();
    }
};

module.exports = { connect, disconnect };
