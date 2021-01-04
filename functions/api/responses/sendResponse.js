const sendSuccessResponse = (res, payload) => {
  if (!payload) {
    return res.status(200).json();
  } else {
    return res.status(200).json({
      data: payload
    });
  }
};

const sendErrorResponse = (res, code, message) => {
  return res.status(code).json({
    error: {
      code:     code,
      message:  message
    }
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse
};