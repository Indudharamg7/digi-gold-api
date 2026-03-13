const { generateToken } = require("../cryptography/token");
const { successResponse, errorResponse } = require("../utils/respone");

module.exports.createToken = async (event) => {
  try {
    console.log("digi-gold-api [create_token]");

    const token = await generateToken({
      service: "digi-gold-api",
    });

    console.log("digi-gold-api [create_token] Token generated successfully");

    return successResponse(token, "Token generated successfully");
  } catch (error) {
    console.error(
      "digi-gold-api [create_token] Token generation error:",
      error,
    );

    return errorResponse("Token generation failed", error.message);
  }
};
