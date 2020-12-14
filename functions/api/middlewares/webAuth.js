const { admin } = require('../../config');
const { AUTH_ERROR_DECODE, AUTH_ERROR_NO_TOKEN } = require("../routes/ResponseMessage");

module.exports.verifyToken  = async (req, res, next) => {
  const idToken = req.headers.authorization;

  if (idToken) {
    try {
      req.currentUser = await admin.auth().verifyIdToken(idToken);
      return next();
    } catch (err) {
      return res.status(401).send({ message: AUTH_ERROR_DECODE });
    }
  } else {
    return res.status(401).send({ message: AUTH_ERROR_NO_TOKEN });
  }
};