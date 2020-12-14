const { AUTH_ERROR } = require("../routes/ResponseMessage");

const hello_world = (req, res) => {
  if (req.currentUser) {
    const helloWorld = {
      message: 'Hello World!'
    };

    return res.status(200).send({
      data: helloWorld
    });
  } else {
    return res.status(401).send({
      status_code:  401,
      message:      AUTH_ERROR
    });
  }
};

module.exports = {
  hello_world
};