# node_lambda_function_template

## Folder and File Structure

### Dealing with Secrets

1. All Secrets are handled by `secretFactory`
2. Getting secrets from AWS Secrets Manager into the Lambda Function can be done as follows:
   1. Name your secrets with the `SECRET_` prefix as an environment variable
   2. Add the path of the AWS Secret Manager as the value of the environment variable
   3. Get the secret via the `secretFactory.get("SECRET_YOUR_SECRET")` call

### API Routing

1. API Routing is handled by `index.mjs`
2. API logic should be in there own function

### Error Handling

1. There is a top-level error handler in `index.mjs`, Therefore, let the error bubble up to the top-level error handler
2. API routes should throw errors with the `throw new Error("Error Message")` syntax

## Installation Guide

### Install Docker

```bash
brew install --cask docker
```

### Install AWS SAM CLI

```bash
brew tap aws/tap
brew install aws-sam-cli
```

### Install nodejs18 use NVM

```bash
nvm install 18
nvm use 18
```

### Modify `template.yaml` to reflect the Function

1. Change LambdaFunction Resource Name to reflect the function name
2. Change APIGateway Resource Name to reflect the APIGateway name
3. Fill in the dots and TODO items with the correct values

```yaml
Resources:
  TODO_FUNCTIONNAME
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./dist
      Handler: index.handler
      Runtime: nodejs18.x
      FunctionName: ...............................
      Environment:
        Variables:
          ENVIRONMENT: staging
          IS_SECRET_REMOTE: true
          IS_CONFIG_REMOTE: false
          SECRET_SOME_SECRET: /path/to/secrets.............................
      Events:
        TODO_REPLACE_TestEvent:
          Type: Api
          Properties:
            Path: /test
            Method: POST
            RestApiId:
              Ref: TODO_GATEWAYNAME
      VpcConfig:
        SecurityGroupIds: [.............................]
        SubnetIds: [.............................]
    Metadata:
      SamResourceId: TODO_FUNCTIONNAME

  TODO_GATEWAYNAME:
    Type: AWS::Serverless::Api
    Properties:
      StageName: staging
      EndpointConfiguration:
        Type: REGIONAL
    Metadata:
      SamResourceId: TODO_GATEWAYNAME

```

## Developing locally

### Invoking function locally through local API Gateway

1. Build the Lambda Function with `sam build`
2. Run the Lambda Function locally with `sam local start-api`, All defined endpoints in `template.yaml` will be available at `http://localhost:3000/`

#### Speeding up development

1. On one terminal, run `sam local start-api`
2. One another terminal, run `sam build` on every time you make changes to the code. (There are no `--watch` options for `sam build` yet )

### Invoking function via `start.js`

1. Update `.env` file to reflect the environment variables within `template.yaml`
2. When invoking with `start.js`, the function does not need to be built
3. Modify the event in `events/test.json` to reflect the event you want to test
4. Run `node start.js` to invoke the function

## Deploying to AWS

### Deployment on the first time

```yaml
npm run build && sam build && sam deploy --guided
```

### Subsequent Deployments

```yaml
npm run build && sam build && sam deploy
```
