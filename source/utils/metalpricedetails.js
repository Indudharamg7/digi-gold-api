function buildMetalFields(body) {
  const metal = {
    id: body.id,
    metal_type_1: body.metal_type_1,
    metal_type_1_price: body.metal_type_1_price,
    price_of_metal_1_gram: "1gm",
    metal_type_2: body.metal_type_2,
    metal_type_2_price: body.metal_type_2_price,
    price_of_metal_2_gram: "1gm",
    time: Date.now(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  return metal;
}

module.exports = buildMetalFields;
