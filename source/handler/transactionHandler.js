const buildTransactionsFields = require("../utils/transactiondetails");
const { successResponse, errorResponse } = require("../utils/respone");
const { verifyToken } = require("../cryptography/token");
const {
  insertData,
  getOne,
  updateData,
  deleteData,
  getMany,
} = require("../utils/dbquires");
const generateUUID = require("../utils/uuid");
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

module.exports.addTransaction = async (event) => {
  try {
    const tokenError = validateToken(event);
    if (tokenError) {
      console.log("digi-gold-api [addTransaction] Token validation failed");
      return errorResponse("Token is missing / Invalid token", null, 401);
    }

    const body = JSON.parse(event.body);
    console.log("digi-gold-api [addTransaction] input:", body);

    let user = await getOne("users", {
      $or: [{ user_id: body.user_id }, { mobile_number: body.mobile_no }],
    });

    if (!user) {
      console.log(
        "digi-gold-api [addTransaction] User not found. Creating user...",
      );

      const newUser = {
        user_id: body.user_id || generateUUID(),
        mobile_number: body.mobile_no,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      await insertData("users", newUser);

      user = newUser;

      console.log("digi-gold-api [addTransaction] User created:", newUser);
    }

    const existingPayment = await getOne("transactions", {
      payment_id: body.payment_id,
    });

    if (existingPayment) {
      return errorResponse(
        `Transaction already exists for payment_id: ${body.payment_id}`,
        null,
        400,
      );
    }

    const priceData = await calculatePrice(
      body.order_type,
      body.metal_type,
      body.weightingrms,
      body.amount,
    );

    console.log(
      "digi-gold-api [addTransaction] Price calculation result:",
      priceData,
    );

    if (!priceData) {
      return errorResponse("Failed to calculate price", null, 400);
    }

    body.transaction_id = generateUUID();

    const transactionDetails = buildTransactionsFields({
      ...body,
      ...priceData,
    });

    console.log(
      "digi-gold-api [addTransaction] Transaction details:",
      transactionDetails,
    );

    await insertData("transactions", transactionDetails);

    return successResponse(
      transactionDetails,
      "Transaction added successfully",
    );
  } catch (error) {
    console.error("digi-gold-api [addTransaction] Error:", error);
    return errorResponse("Failed to add transaction", error.message);
  }
};

module.exports.updateTransaction = async (event) => {
  try {
    const tokenError = validateToken(event);
    if (tokenError) {
      console.log("digi-gold-api [updateTransaction] Token validation failed");
      return errorResponse("Token is missing / Invalid token", null, 401);
    }

    const body = JSON.parse(event.body);
    console.log("digi-gold-api [updateTransaction] input:", body);

    const existingTransaction = await getOne("transactions", {
      transaction_id: body.transaction_id,
    });

    if (!existingTransaction) {
      return errorResponse(
        `Transaction not found for transaction_id: ${body.transaction_id}`,
        null,
        404,
      );
    }

    const updatedData = {
      ...existingTransaction,
      ...body,
      updated_at: new Date(),
    };

    await updateData(
      "transactions",
      { transaction_id: body.transaction_id },
      updatedData,
    );

    return successResponse(updatedData, "Transaction updated successfully");
  } catch (error) {
    console.error("digi-gold-api [updateTransaction] Error:", error);
    return errorResponse("Failed to update transaction", error.message);
  }
};

module.exports.getTransactions = async (event) => {
  try {
    const tokenError = validateToken(event);
    if (tokenError) {
      console.log("digi-gold-api [getTransactions] Token validation failed");
      return errorResponse("Token is missing / Invalid token", null, 401);
    }

    const params = event.queryStringParameters || {};

    console.log("digi-gold-api [getTransactions] Query params:", params);

    let filter = {};

    // user_id filter
    if (params.user_id) {
      filter.user_id = params.user_id;
    }

    // mobile number filter
    if (params.mobile_no) {
      filter.mobile_no = params.mobile_no;
    }

    // payment_id filter
    if (params.payment_id) {
      filter.payment_id = params.payment_id;
    }

    // order_type filter (BUY / SELL)
    if (params.order_type) {
      filter.order_type = params.order_type;
    }

    // metal_type filter (Gold / Silver)
    if (params.metal_type) {
      filter.metal_type = params.metal_type;
    }

    // date range filter
    if (params.fromDate || params.toDate) {
      filter.transaction_time = {};

      if (params.fromDate) {
        const fromDate = new Date(params.fromDate);
        fromDate.setHours(0, 0, 0, 0);
        filter.transaction_time.$gte = fromDate.getTime();
      }

      if (params.toDate) {
        const toDate = new Date(params.toDate);
        toDate.setHours(23, 59, 59, 999);
        filter.transaction_time.$lte = toDate.getTime();
      }
    }

    console.log("digi-gold-api [getTransactions] MongoDB filter:", filter);

    const transactions = await getMany("transactions", filter);

    if (!transactions || transactions.length === 0) {
      return errorResponse("No transactions found", null, 404);
    }

    return successResponse(transactions, "Transactions fetched successfully");
  } catch (error) {
    console.error("digi-gold-api [getTransactions] Error:", error);
    return errorResponse("Failed to fetch transactions", error.message);
  }
};

module.exports.deleteTransaction = async (event) => {
  try {
    const tokenError = validateToken(event);
    if (tokenError) {
      console.log("digi-gold-api [deleteTransaction] Token validation failed");
      return errorResponse("Token is missing / Invalid token", null, 401);
    }

    const body = JSON.parse(event.body);
    console.log("digi-gold-api [deleteTransaction] input:", body);

    const existingTransaction = await getOne("transactions", {
      transaction_id: body.transaction_id,
    });

    if (!existingTransaction) {
      return errorResponse(
        `Transaction not found for transaction_id: ${body.transaction_id}`,
        null,
        404,
      );
    }

    await deleteData("transactions", { transaction_id: body.transaction_id });

    return successResponse("Transaction deleted successfully");
  } catch (error) {
    console.error("digi-gold-api [deleteTransaction] Error:", error);
    return errorResponse("Failed to delete transaction", error.message);
  }
};
