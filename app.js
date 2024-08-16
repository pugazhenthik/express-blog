const express = require('express');

const {
    notFoundHandler,
    errorHandler,
} = require('./src/middlewares/errorMiddleware');

const appRouter = require('./src/routes/appRoutes');
const postRouter = require('./src/routes/postRouts');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(appRouter);
app.use('/posts', postRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
