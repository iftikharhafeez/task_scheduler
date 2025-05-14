import { PrivateAPI, PrivateV2API } from '@hypercare/hypercare-api-node-sdk';
import { Logger } from 'pino';

import { Services } from '@customTypes/Services.js';

export type RuntimeObject = {
    requestId: string,
    headers: any,
    hypercareApi: PrivateAPI,
    hypercareApiV2: PrivateV2API,
    logger: Logger,
    services: Services
}