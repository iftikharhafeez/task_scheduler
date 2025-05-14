import _ from "lodash";
import localSecretStore from "./local-secrets.js";
import remoteSecreteStore from "./remote-secrets.js";

export default async (env) => {
  let secretStore = null;

  if (env.config.isSecretRemote) {
    secretStore = await remoteSecreteStore(env, {});
  } else {
    secretStore = await localSecretStore();
  }

  return {
    get: async (key) => await secretStore.get(key),
  };
};
