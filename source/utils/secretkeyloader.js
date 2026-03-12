const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({
  region: "ap-south-1",
});

let cachedSecret = null;

const getSecrets = async () => {
  try {
    if (cachedSecret) {
      console.log("Using cached secrets");
      return cachedSecret;
    }
    const command = new GetSecretValueCommand({
      SecretId: process.env.SECRET_NAME,
    });
    const response = await client.send(command);
    const secrets = JSON.parse(response.SecretString);
    cachedSecret = secrets;
    return secrets;
  } catch (error) {
    console.error("Error fetching secrets:", error);
    throw error;
  }
};

module.exports = { getSecrets };
