import { RuntimeObject } from '@customTypes/RuntimeObject.js';

class BaseService {
    request: RuntimeObject

    constructor(request: RuntimeObject) {
        this.request = request;
    }
}

export default BaseService;