import _ from 'lodash';
import querystring from 'querystring';

import Joi from '@hapi/joi';
import Wreck from '@hapi/wreck';

async function executeNetworkRequest(baseUrl, endpoint, { query, body }, method, headers = {}) {
  const options = {
    baseUrl,
    payload: body,
    headers
  };

  let uri = endpoint;
  if (!_.isEmpty(query)) uri += `&${querystring.parse(query)}`;

  const requestPromise = Wreck.request(method, uri, options);
  try {
    const res = await requestPromise;
    const body = await Wreck.read(res, { json: true });

    return body;
  } catch (err) {
    console.log(err, 'There was an error making the network request');
    throw err;
  }
}

function decodeBase64(body) {
  return new Buffer(body, 'base64').toString('utf8');
}

function isEmail(string) {
  return _.isNil(Joi.string().email().validate(string).error);
}

function lowerize(obj) {
  return Object.keys(obj).reduce((acc, k) => {
    acc[k.toLowerCase()] = obj[k];
    return acc;
  }, {});
}

function isJSON(string) {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
}

export default{
  executeNetworkRequest,
  decodeBase64,
  isEmail,
  lowerize,
  isJSON,
};
