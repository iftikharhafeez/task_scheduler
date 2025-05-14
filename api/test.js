import _ from "lodash";

export const getOrganization = async (res, runtimeObject, queryParams) => {
  const organizationId = _.isNumber(queryParams.organization)
    ? queryParams.organizationId
    : _.toNumber(queryParams.organizationId);
  const organizationData =
    await runtimeObject.services.organization.getOrganization(organizationId);

  res.statusCode = 200;
  res.body = JSON.stringify(organizationData);
};
