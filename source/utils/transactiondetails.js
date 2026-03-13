function buildTransactionsFields(body) {
  const transaction = {
    transaction_id: body.id,
    user_id: body.user_id,
    metal_type: body.metal_type,
    metal_price: body.metal_price,
    quantity: body.quantity,
    price_per_grm: body.price_per_grm,
    base_price: body.base_price,
    cgst: "1.5%",
    igst: "1.5%",
    total_price: body.total_price,
    transaction_time: Date.now(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  return transaction;
}

module.exports = buildTransactionsFields;
