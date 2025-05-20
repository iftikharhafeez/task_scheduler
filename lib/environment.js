import dotenv from 'dotenv';

dotenv.config();

export const env = {
  task_table: process.env.TASK_TABLE_NAME,
  config: {
    isConfigRemote: process.env.IS_CONFIG_REMOTE === "true",
    isSecretRemote: process.env.IS_SECRET_REMOTE === "true"
  },
};

let state = process.env.ENVIRONMENT;

export const getEnvironment = () => {
  return state;
};

export const isDevelopment = () => {
  return state === "development";
};
