const jwt = require("jsonwebtoken");
const { getSecrets } = require("../utils/secretkeyloader");

const generateToken = async (payload) => {
  console.log("Generating token with payload:", payload);

  const secrets = await getSecrets();

  const token = jwt.sign(payload, secrets.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

const verifyToken = async (token) => {
  try {
    const secrets = await getSecrets();
    return jwt.verify(token, secrets.JWT_SECRET);
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
