const encryptData = require("../cryptography/encryption");

function buildUserFields(body) {
  const user = {
    user_id: body.user_id,

    name: body.name,

    email: body.email,

    mobile_number: body.mobile_number,

    address: {
      line1: body.address?.line1 || null,
      line2: body.address?.line2 || null,
      city: body.address?.city || null,
      state: body.address?.state || null,
      pincode: body.address?.pincode || null,
      country: body.address?.country || "India",
    },

    bank_details: {
      account_holder_name: body.bank_details?.account_holder_name || null,
      account_number: body.bank_details?.account_number || null,
      ifsc_code: body.bank_details?.ifsc_code || null,
      bank_name: body.bank_details?.bank_name || null,
      branch_name: body.bank_details?.branch_name || null,
    },

    kyc_details: {
      pan_number: body.kyc_details?.pan_number
        ? encryptData(body.kyc_details.pan_number)
        : null,

      aadhaar_number: body.kyc_details?.aadhaar_number
        ? encryptData(body.kyc_details.aadhaar_number)
        : null,

      kyc_verified: body.kyc_details?.kyc_verified || false,

      verified_at: body.kyc_details?.verified_at || Date.now(),
    },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return user;
}

module.exports = buildUserFields;
