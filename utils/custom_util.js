import _ from 'lodash';

import Joi from '@hapi/joi';

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
