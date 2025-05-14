import _ from "lodash";

const secretsFile = process.env.SECRET_CONFIG;
const nonsecretsFile = process.env.GENERAL_CONFIG;

let configData = null;

const get = async (name) => {
  return configData[name];
};

export default async () => {
  configData = _.merge(secretsFile, nonsecretsFile);

  return { get };
};
