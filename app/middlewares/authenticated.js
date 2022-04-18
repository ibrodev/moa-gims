const jwt = require("jsonwebtoken");
const UserModel = require("../models").User;
const { ACCESS_TOKEN_SECRET } = require("../../config/app");

module.exports = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) return res.sendStatus(401);

  const token = authorization.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(401);

    const { id } = decoded;

    try {
      const user = await UserModel.findOne({ where: { id } });
      if (!user) return res.sendStatus(401);

      req.user = user;
      return next();
    } catch (error) {
      next(error);
    }
  });
};
