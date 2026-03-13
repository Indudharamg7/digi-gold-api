const {
  insertData,
  getOne,
  updateData,
  deleteData,
} = require("../utils/dbquires");
const generateUUID = require("../utils/uuid");
const buildUser = require("../utils/userdetails");
const encryptData = require("../cryptography/encryption");
const decryptData = require("../cryptography/decryption");
const { successResponse, errorResponse } = require("../utils/respone");
const { verifyToken } = require("../cryptography/token");

// *
//   * Authentication middleware to verify token
// *

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

/**
 * Add User
 */
module.exports.addUser = async (event) => {
  try {
    //token validation
    const tokenError = validateToken(event);
    if (tokenError) {
      console.log("digi-gold-api [addUser] Token validation failed");
      return errorResponse("Token is missing / Invalid token", null, 401);
    }
    const body = JSON.parse(event.body);
    confirm.log("digi-gold-api [addUser] input : ", body);

    //fetching existing user with same mobile number or pan number
    const existingUser = await getOne("users", {
      $or: [
        { mobile_number: body.mobile_number },
        { pan_number: body.kyc_details.pan_number },
      ],
    });

    console.log(
      "digi-gold-api [addUser] Existing user check result: ",
      existingUser,
    );

    if (existingUser) {
      return errorResponse(
        `User with same mobile number or PAN already exists with Userid :${existingUser.user_id}`,
        null,
        400,
      );
    } else {
      body.user_id = generateUUID();

      const user = buildUser(body);
      console.log("digi-gold-api [addUser] Built user object: ", user);
      await insertData("users", user);
      confirm.log(
        "digi-gold-api [addUser] User inserted successfully with user_id: ",
        user,
      );
      return successResponse(user, "User created successfully");
    }
  } catch (error) {
    console.log("digi-gold-api [addUser] Error creating user:", error);
    return errorResponse("User creation failed", error.message);
  }
};

/**
 * Get User
 */
module.exports.getUser = async (event) => {
  try {
    //token validation
    const tokenError = validateToken(event);
    if (tokenError) {
      console.log("digi-gold-api [getUser] Token validation failed");
      return errorResponse("Token is missing / Invalid token", null, 401);
    }
    //fetching user with user_id or mobile number
    let user = null;
    if (event.pathParameters?.user_id) {
      console.log(
        "digi-gold-api [getUser] Fetching user with user_id: ",
        event.pathParameters.user_id,
      );
      const user_id = event.pathParameters.user_id;
      user = await getOne("users", { user_id });
    } else if (event.pathParameters?.mobile_number) {
      console.log(
        "digi-gold-api [getUser] Fetching user with mobile_number: ",
        event.pathParameters.mobile_number,
      );
      const mobile_number = event.pathParameters.mobile_number;
      user = await getOne("users", { mobile_number });
    }
    if (!user) {
      console.log("digi-gold-api [getUser] User not found");
      return errorResponse("User not found");
    }
    if (user.kyc_details?.pan_number) {
      user.kyc_details.pan_number = decryptData(user.kyc_details.pan_number);
    }
    if (user.kyc_details?.aadhaar_number) {
      user.kyc_details.aadhaar_number = decryptData(
        user.kyc_details.aadhaar_number,
      );
    }
    console.log("digi-gold-api [getUser] User fetched successfully: ", user);
    return successResponse(user, "User fetched successfully");
  } catch (error) {
    console.error("digi-gold-api [getUser] Error fetching user:", error);
    return errorResponse("Failed to fetch user", error.message);
  }
};

/**
 * Update User
 */
module.exports.updateUser = async (event) => {
  try {
    //token validation
    const tokenError = validateToken(event);
    if (tokenError) {
      console.log("digi-gold-api [updateUser] Token validation failed");
      return errorResponse("Token is missing / Invalid token", null, 401);
    }
    //fetching existing user with user_id
    let existingUser = null;
    const body = JSON.parse(event.body);
    const user_id = body.user_id;
    console.log(
      "digi-gold-api [updateUser] Fetching user with user_id: ",
      user_id,
    );
    existingUser = await getOne("users", { user_id });
    if (!existingUser) {
      console.log(
        "digi-gold-api [updateUser] User not found with given user_id to update",
      );
      return errorResponse("User not found with given user_id to update");
    } else {
      const body = JSON.parse(event.body);
      console.log("digi-gold-api [updateUser] Update input: ", body);
      if (body.kyc_details?.pan_number) {
        body.kyc_details.pan_number = encryptData(body.kyc_details.pan_number);
      }
      if (body.kyc_details?.aadhaar_number) {
        body.kyc_details.aadhaar_number = encryptData(
          body.kyc_details.aadhaar_number,
        );
      }
      await updateData("users", { user_id }, body);
      console.log(
        "digi-gold-api [updateUser] User details updated successfully",
      );
      return successResponse({}, "User details updated successfully");
    }
  } catch (error) {
    console.log("digi-gold-api [updateUser] Error updating user:", error);
    return errorResponse("User update failed", error.message);
  }
};
/**
 * Delete User
 */
module.exports.deleteUser = async (event) => {
  try {
    //token validation
    const tokenError = validateToken(event);
    if (tokenError) {
      console.log("digi-gold-api [deleteUser] Token validation failed");
      return errorResponse("Token is missing / Invalid token", null, 401);
    }
    //fetching existing user with user_id
    const body = JSON.parse(event.body);
    const user_id = body.user_id;
    console.log(
      "digi-gold-api [deleteUser] Fetching user with user_id: ",
      user_id,
    );
    const existingUser = await getOne("users", { user_id });
    if (!existingUser) {
      console.log(
        "digi-gold-api [deleteUser] User not found with given user_id to delete",
      );
      return errorResponse("User not found with given user_id to delete");
    } else {
      await deleteData("users", { user_id });
      console.log("digi-gold-api [deleteUser] User deleted successfully");
      return successResponse({}, "User deleted successfully");
    }
  } catch (error) {
    console.log("digi-gold-api [deleteUser] Error deleting user:", error);
    return errorResponse("User deletion failed", error.message);
  }
};
