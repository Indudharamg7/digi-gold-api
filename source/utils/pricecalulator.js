const { getOne } = require("./dbquires");

async function calculatePrice(orderType, metal, weightingrms, amt) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

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

  const CGST_PERCENT = 1.5;
  const IGST_PERCENT = 1.5;

  if (weightingrms) {
    const baseAmount = pricePerGram * weightingrms;

    const cgst = (baseAmount * CGST_PERCENT) / 100;
    const igst = (baseAmount * IGST_PERCENT) / 100;

    const totalAmount = baseAmount + cgst + igst;

    return {
      order_type: orderType,
      metal,
      grams: weightingrms,
      price_per_gram: pricePerGram,
      base_amount: Math.round(baseAmount),
      cgst: Math.round(cgst),
      igst: Math.round(igst),
      total_amount: Math.round(totalAmount),
    };
  }

  if (amt) {
    const cgst = (amt * CGST_PERCENT) / 100;
    const igst = (amt * IGST_PERCENT) / 100;

    const totalAmount = amt + cgst + igst;

    return {
      order_type: orderType,
      metal,
      amount: amt,
      grams: (amt / pricePerGram).toFixed(4),
      price_per_gram: pricePerGram,
      cgst: Math.round(cgst),
      igst: Math.round(igst),
      total_amount: Math.round(totalAmount),
    };
  }

  throw new Error("Provide either weightingrms or amt");
}

module.exports = { calculatePrice };
