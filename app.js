const express = require('express');
const connectDB = require('./src/config/database');

const {
    notFoundHandler,
    errorHandler,
} = require('./src/middlewares/errorMiddleware');

const appRouter = require('./src/routes/appRoutes');
const categoryRouter = require('./src/routes/categoryRoutes');
const postRouter = require('./src/routes/postRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

app.use(appRouter);
app.use('/posts', postRouter);
app.use('/categories', categoryRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
