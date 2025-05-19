# 🗓️ Serverless Task Scheduler (Node.js + AWS SAM)

A simple and scalable serverless task scheduler using AWS Lambda, DynamoDB, and EventBridge. Supports scheduling HTTP/webhook actions to be executed at specific times.

---

## 📁 Folder & File Structure

```
.
├── bootstrap/               # App initialization (logger, AWS clients, db)
├── handlers/               # Lambda entrypoints (API, scheduler, executor)
├── lib/                    # Logger, AWS SDK clients
├── models/                 # DynamoDB models
├── services/               # Business logic
├── index.js                # Single unified Lambda entrypoint
├── start.js                # Local dev/testing entrypoint (Express server)
├── scripts/createTable.sh  # Script to bootstrap local DynamoDB table
├── docker-compose.yml      # Runs DynamoDB Local
├── template.yaml           # AWS SAM template
└── package.json
```

---

## 🧠 Architecture Overview

- **API Gateway + Lambda**: Accepts `/schedule-task` requests
- **DynamoDB**: Persists scheduled tasks
- **EventBridge**: Triggers Scheduler every 1 minute
- **Scheduler Lambda**: Finds due tasks and invokes executor
- **Executor Lambda**: Performs webhook POST
- **Local Mode**: Runs everything locally with DynamoDB Local + Express

---

## 🧰 Installation Guide

### ✅ Prerequisites

- [Node.js v18+](https://nodejs.org/) (use `nvm install 18`)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 📦 Install dependencies

```bash
npm install
```

---

## 🚀 Running Locally

### 🔁 Option 1: Full Local Mode with DynamoDB Local

#### 1. Start DynamoDB Local

```bash
npm run local-dynamodb
```
OR manually:
```bash
docker run -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -inMemory -sharedDb
```

#### 2. Create TaskTable in DynamoDB Local

```bash
chmod +x ./scripts/createTable.sh
./scripts/createTable.sh
```

#### 3. Run Local API Server (Express)

```bash
npm run dev
```

#### 4. Schedule a Task

```bash
curl -X POST http://localhost:3000/schedule-task \
  -H "Content-Type: application/json" \
  -d '{
        "action": "webhook",
        "payload": {
          "url": "https://example.com/notify",
          "data": { "message": "Hello local!" }
        },
        "run_at": "2025-06-10T15:00:00Z"
      }'
```

---

### 🧪 Option 2: Run With AWS SAM Locally

#### 1. Build SAM project

```bash
sam build
```

#### 2. Start API Gateway locally

```bash
sam local start-api
```

Then test at:  
`http://localhost:3000/schedule-task`

---

## ☁️ Deploying to AWS

### 🔰 First Time

```bash
sam build && sam deploy --guided
```

You will be prompted to:
- Enter stack name
- Set AWS region
- Set capabilities
- Save these settings for future deploys

### 🔁 Subsequent Deploys

```bash
sam build && sam deploy
```

---

## 🧪 Testing Locally with `start.js`

- `start.js` sets up a simple Express server for local endpoint testing.
- Uses `IS_OFFLINE=true` to connect to local DynamoDB.
- Use this for fast development without AWS infrastructure.

---

## 🔍 Health Check (Optional)

You can add a health endpoint to `start.js`:
```js
app.get('/health', async (req, res) => {
  try {
    await app.db.scan({ TableName: process.env.TASK_TABLE_NAME }).promise();
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: 'DynamoDB not reachable', detail: err.message });
  }
});
```

---

## 🧼 Environment Variables

| Variable           | Usage                          | Required for |
|--------------------|--------------------------------|--------------|
| `TASK_TABLE_NAME`  | Name of the DynamoDB table     | ALL          |
| `AWS_REGION`       | AWS region (default: `us-east-1`) | AWS / Local |
| `IS_OFFLINE`       | Set to `true` for local testing | Local only   |
| `EXECUTE_TASK_FUNCTION` | ARN or name of executor lambda | Scheduler Lambda |

---

## 📦 NPM Scripts

```json
"scripts": {
  "dev": "IS_OFFLINE=true node start.js",
  "local-dynamodb": "docker-compose up"
}
```

---

## 📂 Sample Event (for testing manually)

```json
{
  "action": "webhook",
  "payload": {
    "url": "https://example.com/notify",
    "data": {
      "message": "This is your scheduled task!"
    }
  },
  "run_at": "2025-06-10T15:00:00Z"
}
```

---

## ✅ TODOs & Bonus Ideas

- [ ] Add recurrence support (`daily`, `weekly`)
- [ ] Add `GET /tasks` to list scheduled tasks
- [ ] Add task status tracking dashboard (React or simple CLI)
- [ ] Add SNS/email notifications on failure/completion

---

## 🧠 Notes

- Uses AWS SDK v2 — production safe but under maintenance.
- AWS SDK v3 migration is optional but encouraged over time.
- Lightweight Express server makes development fast and easy.

---

Built with ❤️ for scalable task scheduling in a serverless world.
