const UserModel = require("../models/").User;
const EmployeeModel = require("../models/").Employee;

module.exports = {
  // Find all users
  findAll: async (req, res, next) => {
    try {
      const users = await UserModel.findAll({
        include: [
          {
            model: EmployeeModel,
          },
        ],
      });
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
};
