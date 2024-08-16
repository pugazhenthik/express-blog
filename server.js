const http = require('http');
require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;

server = http.createServer(app);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
