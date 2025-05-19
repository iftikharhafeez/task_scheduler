const dotenv = require('dotenv');
dotenv.config();

const TABLE_NAME = process.env.TASK_TABLE_NAME;

class TaskModel {
    constructor(db) {
        this.db = db;
    }

    async createTask(task) {
        await this.db.put({
            TableName: TABLE_NAME,
            Item: task
        }).promise();
    }

    async getDueTasks() {
        const now = new Date().toISOString();
        const result = await this.db.scan({
            TableName: TABLE_NAME,
            FilterExpression: '#status = :scheduled AND run_at <= :now',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: { ':scheduled': 'scheduled', ':now': now }
        }).promise();

        return result.Items || [];
    }

    async updateTaskStatus(taskId, status) {
        await this.db.update({
            TableName: TABLE_NAME,
            Key: { task_id: taskId },
            UpdateExpression: 'SET #status = :status, updated_at = :updatedAt',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
                ':status': status,
                ':updatedAt': new Date().toISOString()
            }
        }).promise();
    }
}

module.exports = TaskModel;
