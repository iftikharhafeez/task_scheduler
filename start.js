const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const index = require('./index');   // Your main Lambda entry

app.post('/schedule-task', async (req, res) => {
    console.log({ body: req.body, headers: req.headers }, 'Received request');

    const event = {
        headers: req.headers,
        body: JSON.stringify(req.body)
    };

    try {
        // 🟢 Call your Lambda function's api handler
        const response = await index.api(event);

        console.log(response, 'Lambda executed');
        res.status(response.statusCode || 200).json(JSON.parse(response.body));
    } catch (err) {
        console.error(err, 'Error executing Lambda function');
        res.status(500).json({ message: 'Internal server error', error: err.toString() });
    }
});

app.listen(port, () => {
    console.log(`Local server listening on port ${port}`);
});
