import _ from "lodash";
import awsSdk from "aws-sdk";
import utils from "../../utils/custom_util.js";

export default async (env, localSecrets) => {
  const config = env.config;
  const secretsManager = new awsSdk.SecretsManager();

  const loadSecretContent = async (secretName) => {
    try {
      const value = await secretsManager
        .getSecretValue({ SecretId: secretName })
        .promise();
      return value.SecretString;
    } catch {
      return null;
    }
  };

  const loadSecretsFromManager = async () => {
    let cache = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (!_.startsWith(key, "SECRET_")) {
        continue;
      }
      const secretValue = await loadSecretContent(value);
      cache[key] = utils.isJSON(secretValue)
        ? JSON.parse(secretValue)
        : secretValue;
    }
    return cache;
  };

  const buildSecretStore = async (primer) => {
    let cache = primer || {};

    return {
      get: async (name) => {
        let secretValue = cache[name];
        if (!secretValue) {
          secretValue = await loadSecretContent(name);
          secretValue ? (cache[name] = secretValue) : void 0;
        }

        if (_.isEmpty(secretValue)) {
          return null;
        }

        return secretValue;
      },
    };
  };

  const secrets = await loadSecretsFromManager();

  return await buildSecretStore(
    _.assign(localSecrets, {
      ...secrets,
      ...config,
    })
  );
};
