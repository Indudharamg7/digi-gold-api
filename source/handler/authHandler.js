const { generateToken } = require("../cryptography/token");
const { successResponse, errorResponse } = require("../utils/respone");

module.exports.createToken = async (event) => {
  try {
    console.log("Starting token generation process...");

    const token = await generateToken({
      service: "digi-gold-api",
    });

    console.log("Generated JWT Token:", token);

    return successResponse(token, "Token generated successfully");
  } catch (error) {
    console.error("Token generation error:", error);

    return errorResponse("Token generation failed", error.message);
  }
};
