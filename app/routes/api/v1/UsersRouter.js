const express = require("express");
const UsersRouter = express.Router();

const UsersModel = require("../../../models").User;

UsersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

UsersRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = UsersRouter;
