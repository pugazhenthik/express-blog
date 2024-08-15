const express = require('express');
require('dotenv').config();
const redis = require('redis');
const axios = require('axios');

const app = express();
let redisClient;

const baseUrl = process.env.BASE_URL;
const port = process.env.PORT || 3000;

(async () => {
    redisClient = redis.createClient();
    redisClient.on('error', (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
})();

app.get('/', async (req, res) => {
    let cached = false;
    let result;
    let start = new Date().getTime();
    let cachedResult = await redisClient.get('todos', (error, todos) => {
        if (error) console.log('Something went wrong');
        if (todos) return todos;
    });

    if (cachedResult) {
        cached = true;
        result = JSON.parse(cachedResult);
    } else {
        const { data } = await axios.get(
            'https://jsonplaceholder.typicode.com/todos',
        );
        await redisClient.SETEX('todos', 30000, JSON.stringify(data));
        result = data;
    }
    let end = new Date().getTime();
    let resposneTime = (end - start) / 1000;
    res.send({ responseTime: resposneTime, fromCache: cached, data: result });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at ${baseUrl}:${port}`);
});
