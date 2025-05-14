import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import packageJson from "../package.json" assert { type: "json" };
import os from "os";
import pino from "pino";
import {
  lambdaRequestTracker,
  pinoLambdaDestination,
  PinoLogFormatter,
} from "pino-lambda";

function createLogger() {
  const context = {
    region: process.env.AWS_REGION,
    requestId: uuidv4(),
    environment: process.env.ENVIRONMENT,
  };

  let logLevel = "debug";
  if (context.environment === "staging") logLevel = "info";
  else if (context.environment === "prod") logLevel = "info";

  const destination = pinoLambdaDestination({
    formatter: new PinoLogFormatter(),
  });
  const logger = pino(
    {
      level: logLevel,
      base: _.assign(
        {
          service: packageJson.name,
          pid: process.pid,
          hostname: os.hostname,
        },
        context
      ),
    },
    destination
  );

  return logger;
}


export {createLogger};
