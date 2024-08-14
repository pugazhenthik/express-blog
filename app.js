const express = require('express');
const dotenv = require('dotenv').config();
const app = express();

const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`[server]: Server is running at ${baseUrl}:${port}`);
});
