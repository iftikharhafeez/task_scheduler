import dotenv from 'dotenv';
dotenv.config();
import _ from 'lodash';

import { getOrganization } from './api/test.js';
import bootstrap from './bootstrap/index.js';

import util from './utils/custom_util.js';
import Errors from '@utils/errors.js';

if (!process.env.AWS_REGION) process.env.AWS_REGION = 'ca-central-1';
global.awsRegion = process.env.AWS_REGION;

async function routes(res, event) {
  const RuntimeObject = await bootstrap(event);

  try {
    let payload = null;
    if (event.body) payload = JSON.parse(event.body);

    let queryParams = event.queryStringParameters || {};

    const eventPath = _.trimEnd(event.path, '/');
    RuntimeObject.logger.info({ eventPath }, 'Request path');

    switch (eventPath) {
      case '/test':
        if (queryParams.organizationId)
          await getOrganization(res, RuntimeObject, queryParams);
        else
          throw new Errors.InvalidRequest('Site or Department ID must be provided for request', 401);
        break;
    }
  } catch (err) {
    RuntimeObject.logger.error({ error: err }, 'There was an error processing request');

    res.statusCode = err.status ? err.status : 500;
    res.body = JSON.stringify({
      name: err.name,
      message: err.message,
    });
  }
}

const handler = async (event, context) => {
  let res = {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json, */*',
      'Access-Control-Allow-Headers':
        'authorization,cache-control,content-type,expires,hc-timezone,hypercare-scope,pragma,x-request-id',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Credentials': true,
    },
    isBase64Encoded: false,
    body: JSON.stringify({
      message: `Endpoint ${event.path} doesn't exists, please refer to the documentation`,
    }),
  };

  //Manually Handling CORS Preflight due to Lambda Proxy Integration
  if (event.httpMethod === 'OPTIONS') {
    res.statusCode = 200;
    res.body = JSON.stringify({
      message: 'Preflight Success',
    });

    return res;
  }

  event.headers = util.lowerize(event.headers);
  if (!event.headers['hypercare-scope']) {
    res.statusCode = 401;
    res.body = JSON.stringify({
      message: 'Missing Hypercare-Scope header',
    });

    return res;
  }

  await routes(res, event);
  
  return res;
};

export { handler };
