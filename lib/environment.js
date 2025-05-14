import dotenv from "dotenv";
dotenv.config();

export const env = {
  environment: process.env.ENVIRONMENT,
  config: {
    isConfigRemote: process.env.IS_CONFIG_REMOTE === "true",
    isSecretRemote: process.env.IS_SECRET_REMOTE === "true",
    HC_API_URL: process.env.HC_API_URL,
  },
};

let state = process.env.ENVIRONMENT;

export const getEnvironment = () => {
  return state;
};

export const isProduction = () => {
  return state === "prod";
};

export const isStaging = () => {
  return state === "staging";
};

export const isDevelopment = () => {
  return state === "development";
};
