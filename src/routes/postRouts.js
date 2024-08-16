const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const posts = [
        {
            id: 1,
            title: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus reprehenderit',
            body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, nihil consequuntur? Praesentium minima cumque similique porro dolorem neque, aut natus incidunt! Autem inventore minus voluptatem reprehenderit non dicta placeat recusandae?',
            createdAt: new Date().getDay(),
            isActive: true,
        },
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

router.get('/:id', (req, res) => {
    const post = {
        id: 1,
        title: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus reprehenderit',
        body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, nihil consequuntur? Praesentium minima cumque similique porro dolorem neque, aut natus incidunt! Autem inventore minus voluptatem reprehenderit non dicta placeat recusandae?',
        createdAt: new Date().getDay(),
        isActive: true,
    };

    res.json({ data: post });
});

module.exports = router;
