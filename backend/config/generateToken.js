const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id },'mohisecret', {
    expiresIn: "30d",
  });
};

module.exports = generateToken;