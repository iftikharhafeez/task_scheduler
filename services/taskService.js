const TaskModel = require('../models/taskModel');

class TaskService {
    constructor(db, logger) {
        this.taskModel = new TaskModel(db);
        this.logger = logger;
    }

    async scheduleTask(task) {
        await this.taskModel.createTask(task);
    }

    async findAndRunDueTasks(lambdaClient) {
        const tasks = await this.taskModel.getDueTasks();
        for (const task of tasks) {
            await lambdaClient.invoke({
                FunctionName: process.env.EXECUTE_TASK_FUNCTION,
                InvocationType: 'Event',
                Payload: JSON.stringify({ task })
            }).promise();

            await this.taskModel.updateTaskStatus(task.task_id, 'running');
        }
    }

    async completeTask(taskId) {
        await this.taskModel.updateTaskStatus(taskId, 'completed');
    }

    async failTask(taskId) {
        await this.taskModel.updateTaskStatus(taskId, 'failed');
    }
}

module.exports = TaskService;
