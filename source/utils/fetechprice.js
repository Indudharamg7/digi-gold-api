const axios = require("axios");

const metalMap = {
  gold: "XAU",
  silver: "XAG",
};

const fetchPrice = async (metal) => {
  try {
    const symbol = metalMap[metal.toLowerCase()];

    if (!symbol) {
      throw new Error("Invalid metal type");
    }

    console.log(`[digi-gold-api] fetchPrice ${metal} (symbol: ${symbol})`);

    const url = `https://api.gold-api.com/price/${symbol}`;
    const response = await axios.get(url);
    console.log(`[digi-gold-api] fetchPrice API response:`, response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      `[digi-gold-api] Error fetching price for ${metal}:`,
      error.message,
    );
    console.error("Error fetching price:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  fetchPrice,
};
