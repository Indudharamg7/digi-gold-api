function successResponse(data = {}, message = "Success") {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: true,
      message: message,
      data: data,
    //   error: null,
    }),
  };
}

function errorResponse(
  message = "Something went wrong",
  error = null,
  code = 500,
) {
  return {
    statusCode: code,
    body: JSON.stringify({
      status: false,
      message: message,
      //   data: null,
      //   error: error,
    }),
  };
}

module.exports = {
  successResponse,
  errorResponse,
};
