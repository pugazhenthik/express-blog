const mongoose = require('mongoose');
const url =
    'mongodb://127.0.0.1:27017/express_blog?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0';

const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(url, clientOptions);
        if (connection) {
            await mongoose.connection.db.admin().command({ ping: 1 });
            console.log(`MongoDB Connected`);
        } else {
            console.log('MongoDB connection failed');
        }
    } catch (error) {
        console.log(`MongoDB Not Connected`);
        console.log(error.message);
    }
};

module.exports = { connectDB };
