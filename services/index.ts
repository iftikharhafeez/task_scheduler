import { RuntimeObject } from '@customTypes/RuntimeObject.js';
import { Services } from '@customTypes/Services.js';

import OrganizationService from './organization.js';

export default (request: RuntimeObject): Services => {
    return {
        organization: new OrganizationService(request)
    }
}