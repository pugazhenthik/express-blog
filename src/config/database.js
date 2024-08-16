const mongoose = require('mongoose');
require('dotenv');

const password = process.env.DB_PASSWORD;
const username = process.env.DB_USERNAME;
const hostname = process.env.DB_HOSTNAME;
const appname = process.env.DB_APPNAME;

const url = `mongodb+srv://${username}:${password}@${hostname}.mongodb.net/blog?retryWrites=true&w=majority&appName=${appname}`;

const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const connectDB = async () => {
    try {
        await mongoose.connect(url, clientOptions);

        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.log(`MongoDB Not Connected`);
    } finally {
        await mongoose.disconnect();
        console.log(`MongoDB Connection Closed`);
    }
};

connectDB();
