const express = require('express');

const {
    notFoundHandler,
    errorHandler,
} = require('./src/middlewares/errorMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    const posts = [
        {
            id: 1,
            title: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus reprehenderit',
            body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, nihil consequuntur? Praesentium minima cumque similique porro dolorem neque, aut natus incidunt! Autem inventore minus voluptatem reprehenderit non dicta placeat recusandae?',
            createdAt: new Date().getDay(),
            isActive: true,
        },
    ];
    res.json({ data: posts });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
