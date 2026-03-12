const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(
  path.join(__dirname, "privateKey.pem"),
  "utf8",
);

function decryptData(encryptedData) {
  try {
    const buffer = Buffer.from(encryptedData, "base64");

    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      buffer,
    );

    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption Error:", error);
    throw error;
  }
}

module.exports = decryptData;
