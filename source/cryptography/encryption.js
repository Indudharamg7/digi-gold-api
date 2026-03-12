const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(
  path.join(__dirname, "publicKey.pem"),
  "utf8",
);

function encryptData(data) {
  try {
    const buffer = Buffer.from(data, "utf8");

    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      buffer,
    );

    return encrypted.toString("base64");
  } catch (error) {
    console.error("Encryption Error:", error);
    throw error;
  }
}

module.exports = encryptData;
