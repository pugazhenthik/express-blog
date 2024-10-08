const express = require('express');
const { connectDB } = require('./src/config/database');

const {
    notFoundHandler,
    errorHandler,
} = require('./src/middlewares/errorMiddleware');

const appRouter = require('./src/routes/appRoutes');
const authRouter = require('./src/routes/authRoutes');
const categoryRouter = require('./src/routes/categoryRoutes');
const postRouter = require('./src/routes/postRoutes');
const tagRouter = require('./src/routes/tagRoutes');
const userRouter = require('./src/routes/userRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

app.use(appRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/categories', categoryRouter);
app.use('/tags', tagRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
