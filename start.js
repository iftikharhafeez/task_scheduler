const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const index = require('./index');   // Your main Lambda entry


app.post('/run-scheduler', async (req, res) => {

    const event = {
        headers: req.headers,
        body: JSON.stringify(req.body)
    };

    try {
        const result = await index.scheduler(event);  // simulate EventBridge
        res.status(200).json({ message: 'Scheduler ran', result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

app.get('/tasks', async (req, res) => {
    try {
        const result = await index.app.db.scan({ TableName: process.env.TASK_TABLE_NAME }).promise();
        res.status(200).json(result.Items);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Failed to fetch tasks', error: err.toString() });
    }
});

app.listen(port, () => {
    console.log(`Local server listening on port ${port}`);
});
