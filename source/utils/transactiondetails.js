function buildTransactionsFields(body) {
  const transaction = {
    transaction_id: body.transaction_id,

    user_id: body.user_id,
    mobile_no: body.mobile_no,

    order_type: body.order_type,
    metal_type: body.metal,

    quantity: body.grams,
    price_per_grm: body.price_per_gram,

    base_price: body.base_amount,

    cgst: body.cgst,
    igst: body.igst,

    total_price: body.total_amount,

    payment_id: body.payment_id,

    transaction_time: Date.now(),

    created_at: new Date(),
    updated_at: new Date(),
  };

  return transaction;
}

module.exports = buildTransactionsFields;
