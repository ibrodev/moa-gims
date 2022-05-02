const UserModel = require("../models").User;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
} = require("../../config/app");

module.exports = {
  // Create access token
  create: async (req, res, next) => {
    try {
      let { username = null, password = null } = req.body;

      let errors = {};
      if (!username) errors.username = "username is required";
      if (!password) errors.password = "password is required";

      if (Object.keys(errors).length > 0)
        return res.status(400).json({ errors });

      username = username || validator.escape(validator.trim(username));

      const user = await UserModel.findOne({ where: { username } });

      if (!user || !user.authenticate(password))
        return res
          .status(400)
          .json({ errors: { error: "Invalid username or password" } });

      const { accessToken, refreshToken } = user.authenticateUser();

      res.cookie("token", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: true,
      });

      res.status(200).json({
        token: accessToken,
        userRole: user.role,
        username: user.username,
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update access token
  update: async (req, res, next) => {
    try {
      const { token } = req.cookies;

      if (!token) return res.sendStatus(401);

      jwt.verify(token, REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);

        const { id } = decoded;

        try {
          const user = await UserModel.findOne({ where: { id } });
          if (!user) return res.sendStatus(403);

          const accessToken = user.generateToken({ id }, ACCESS_TOKEN_SECRET, {
            expiresIn: "15s",
          });

          return res.json({
            token: accessToken,
            userRole: user.role,
            username: user.username,
            user,
          });
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete token
  delete: async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403);

      const { id } = decoded;
      res.clearCookie("token", {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: true,
      });

      return res.sendStatus(204);
    });
  },
};
