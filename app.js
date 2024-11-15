const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const apiRouter = require('./src/routes/apiRouter');

const app = express();
const PORT = process.env.PORT;

app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

apiRouter.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Welcome to us");
});

app.use('/api/v1', apiRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});