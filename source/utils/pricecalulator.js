const { getOne } = require("./dbquires");

async function calculatePrice(metal, weightingrms, amt) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  console.log(`calculatePrice called with metal: ${metal}, weightingrms: ${weightingrms}, amt: ${amt}`);
  console.log(
    `Searching for price data for metal: ${metal} between ${startOfDay} and ${endOfDay}`,
  );

  let priceData = await getOne(
    "metal_price_details",
    {
      $or: [{ metal_type_1: metal }, { metal_type_2: metal }],
      created_at: { $gte: startOfDay, $lte: endOfDay },
    },
    { created_at: -1 },
  );

  if (!priceData) {
    priceData = await getOne(
      "metal_price_details",
      {
        $or: [{ metal_type_1: metal }, { metal_type_2: metal }],
      },
      { created_at: -1 },
    );
  }

  if (!priceData) {
    throw new Error(`No price found for metal: ${metal}`);
  }

  let pricePerGram;

  if (metal === priceData.metal_type_1) {
    pricePerGram = priceData.metal_type_1_price;
  } else {
    pricePerGram = priceData.metal_type_2_price;
  }

  if (weightingrms) {
    return {
      metal,
      grams: weightingrms,
      amount: Math.round(pricePerGram * weightingrms),
    };
  }

  if (amt) {
    return {
      metal,
      amount: amt,
      grams: (amt / pricePerGram).toFixed(4),
    };
  }

  throw new Error("Provide either weightingrms or amt");
}

module.exports = { calculatePrice };
