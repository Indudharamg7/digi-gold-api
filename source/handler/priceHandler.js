const { fetchPrice } = require("../utils/fetechprice");
const { successResponse, errorResponse } = require("../utils/respone");
const { verifyToken } = require("../cryptography/token");
const {
  insertData,
  getOne,
  updateData,
  deleteData,
} = require("../utils/dbquires");
const generateUUID = require("../utils/uuid");
const buildMetal = require("../utils/metalpricedetails");
const { calculatePrice } = require("../utils/pricecalulator");

const validateToken = (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization;

  if (!authHeader) {
    console.log(
      "digi-gold-api [validateToken] Token missing in request headers",
    );
    return errorResponse(`Token missing`, null, 400);
  }

  const token = authHeader.replace("Bearer ", "");
  const decoded = verifyToken(token);

  if (!decoded) {
    console.log("digi-gold-api [validateToken] Invalid or expired token");
    return errorResponse(`Invalid or expired token`, null, 400);
  }

  return null;
};

module.exports.getMetalPrice = async (event) => {
  try {
    const tokenError = validateToken(event);
    if (tokenError) {
      confirm.log("digi-gold-api [getMetalPrice] Token validation failed");
      return errorResponse("Token is missing / Invalid token", null, 401);
    }
    const metal = event.queryStringParameters?.metal || "gold";
    console.log(
      `digi-gold-api [getMetalPrice] input : ${event.queryStringParameters?.metal}`,
    );

    const priceData = await fetchPrice(metal);

    console.log(`digi-gold-api [getMetalPrice] Price fetch result:`, priceData);

    if (!priceData.success) {
      return response(400, {
        message: "Failed to fetch metal price",
      });
    }

    return successResponse(priceData.data, "Metal price fetched successfully");
  } catch (error) {
    console.error(error);

    return errorResponse("Failed to fetch metal price", error.message);
  }
};

module.exports.addMetalPrice = async (event) => {
  try {
    const gold = await fetchPrice("gold");
    const silver = await fetchPrice("silver");

    if (!gold.success || !silver.success) {
      console.error("Failed to fetch metal prices:", {
        goldError: gold.error,
        silverError: silver.error,
      });
      return errorResponse(
        "Failed to fetch metal prices",
        "Error fetching gold or silver price",
      );
    }

    const priceData = {
      metal_type_1: gold.data.name,
      metal_type_2: silver.data.name,
      metal_type_1_price: gold.data.price,
      metal_type_2_price: silver.data.price,
    };

    priceData.id = generateUUID();

    const addPriceData = buildMetal(priceData);
    await insertData("metal_price_details", addPriceData);
    console.log(
      "digi-gold-api [addPrice] Price added successfully with id: ",
      addPriceData,
    );
    return successResponse(addPriceData, "Price Details added successfully");
  } catch (error) {
    console.log("digi-gold-api [addPrice] Error adding price details:", error);
    return errorResponse(
      "[digi-gold-api] addPrice Failed to add price",
      error.message,
    );
  }
};

module.exports.calculatePrice = async (event) => {
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    console.log(
      `digi-gold-api [calculatePrice] Input: ${JSON.stringify(body)}`,
    );

    const result = await calculatePrice(
      body.metal_type,
      body.weightingrms,
      body.amt,
    );

    console.log(
      `digi-gold-api [calculatePrice] Calculation price result: ${JSON.stringify(
        result,
      )}`,
    );

    return successResponse(result, "Price calculated successfully");
  } catch (error) {
    return errorResponse("calculatePrice failed", error.message);
  }
};
