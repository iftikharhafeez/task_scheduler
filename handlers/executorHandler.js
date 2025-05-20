const TaskService = require('../services/taskService');
const axios = require('axios');

exports.executorHandler = async (event, app) => {
    const { task } = event;
    const taskService = new TaskService(app.db, app.logger);

    try {
        switch (task.action) {
            case 'webhook':
                await axios.post(task.payload.url, task.payload.data);
                break;

            case 'email':
                // Simulate sending email
                app.logger.info(`Sending email to ${task.payload.to}`);
                app.logger.info(`Subject: ${task.payload.subject}`);
                app.logger.info(`Body: ${task.payload.body}`);
                // TODO: Integrate SES or any email service here
                break;

            case 'message':
                // Simulate publishing a message (e.g., to a queue or log)
                app.logger.info(`Processing message: ${JSON.stringify(task.payload.message)}`);
                break;

            default:
                throw new Error(`Unsupported task action: ${task.action}`);
        }

        await taskService.completeTask(task.task_id);
    } catch (error) {
        app.logger.error('Task execution failed:', error);
        await taskService.failTask(task.task_id);
    }
};
