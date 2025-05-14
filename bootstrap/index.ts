import _ from "lodash";
import moment from "moment-timezone";
import { v4 as uuidv4 } from "uuid";
import { PrivateAPI, PrivateV2API } from "@hypercare/hypercare-api-node-sdk";

import { RuntimeObject } from "@customTypes/RuntimeObject.js";
import { Services } from "@customTypes/Services.js";

import { createLogger } from "@utils/logger.js";

import ServiceFactory from "@services/index.js";

const logger = createLogger();

export default async (event): Promise<RuntimeObject> => {
  const requestId = uuidv4();

  const runtimeObject: RuntimeObject = {
    requestId,
    headers: event.headers || {},
    hypercareApi: await loadMainAPI(event),
    hypercareApiV2: await loadMainAPIV2(event),
    logger: logger.child({
      requestId,
    }),
    services: null,
  };

  runtimeObject.services = await loadServices(runtimeObject);

  return runtimeObject;
};

async function loadMainAPI(event): Promise<PrivateAPI> {
  const splitAuthHeader = _.split(event.headers?.authorization, " ");
  const HC_API_URL = process.env.HC_API_URL;

  console.log({ splitAuthHeader }, "Split Auth header");

  const privateAPI = new PrivateAPI(
    HC_API_URL,
    {
      token: _.last(splitAuthHeader),
      expiryDate: moment().add(1, "day").toISOString(),
    },
    {
      token: "",
      expiryDate: moment().add(1, "day").toISOString(),
    }
  );

  return privateAPI;
}

async function loadMainAPIV2(event): Promise<PrivateV2API> {
  const splitAuthHeader = _.split(event.headers?.authorization, " ");
  const HC_API_URL = process.env.HC_API_URL;

  console.log({ splitAuthHeader }, "Split Auth header");

  const privateAPI = new PrivateV2API(
    HC_API_URL,
    {
      token: _.last(splitAuthHeader),
      expiryDate: moment().add(1, "day").toISOString(),
    },
    {
      token: "",
      expiryDate: moment().add(1, "day").toISOString(),
    }
  );

  return privateAPI;
}

async function loadServices(runtimeObject: RuntimeObject): Promise<Services> {
  return ServiceFactory(runtimeObject);
}
