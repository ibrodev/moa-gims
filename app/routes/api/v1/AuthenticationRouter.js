const express = require("express");
const AuthenticationController = require("../../../controllers/AuthenticationController");
const AuthenticationRouter = express.Router();

// create access token
AuthenticationRouter.post("/", AuthenticationController.create);

// update access token
AuthenticationRouter.get("/", AuthenticationController.update);

// delete refresh token
AuthenticationRouter.delete("/", AuthenticationController.delete);

module.exports = AuthenticationRouter;
