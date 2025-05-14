import _ from "lodash";

export const loadRemoteConfig = async (
  s3,
  kms,
  bucket,
  filePath,
  isEncrypted
) => {
  let configString = await s3.fetchObject(bucket, filePath, "utf8");
  
  isEncrypted ? (configString = await kms.decrypt(configString)) : void 0;

  const config = JSON.parse(configString);
  return config;
};
