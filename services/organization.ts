import * as fs from 'node:fs';
import moment from 'moment-timezone';
import _, { Dictionary } from 'lodash';

import BaseService from '@services/base.js';

import { DateTime } from '@customTypes/DateTime.js';
import { OrganizationData } from '@customTypes/Organization.js';

class OrganizationService extends BaseService {
    async getOrganization(organizationId: Number): Promise<OrganizationData> {
        const fetchOrganizationQuery = fs.readFileSync('constants/graphql/fetch_organization.gql').toString('utf8');
        const timezone = this.request.headers['hc-timezone'] || 'America/Toronto';
        const response = await this.request.hypercareApi.services.generalDAO.graphQLRequest(fetchOrganizationQuery, {
            organizationId,
        }, {
            'hypercare-scope': this.request.headers['hypercare-scope'],
            'hc-timezone': timezone
        });

        return response.data.locating.organization;
    }

  }

export default OrganizationService;