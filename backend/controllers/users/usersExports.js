//Exports de las diferentes funciones para los usuarios
const newUser = require("./newUser");
const loginUser = require("./loginUser");
const modifyUser = require("./modifyUser");
const getUserSpace = require("./getUserSpace");
const getOwnUser = require("./getOwnUser");

module.exports = {
  newUser,
  loginUser,
  modifyUser,
  getUserSpace,
  getOwnUser,
};
