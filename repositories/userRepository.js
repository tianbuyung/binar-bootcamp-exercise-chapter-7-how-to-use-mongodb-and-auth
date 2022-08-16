const User = require("../models/User");

class UserRepository {
  async createUser(payload) {
    let err = null;
    try {
      const newUser = await User.create(payload);
      return [err, newUser];
    } catch (error) {
      err = error;
      return [err, null];
    }
  }
  async viewOneUser(conditions) {
    let err = null;
    try {
      const user = await User.findOne(conditions);
      return [err, user];
    } catch (error) {
      err = error;
      return [err, null];
    }
  }
  async editUser(conditions, update) {
    let err = null;
    try {
      const user = await User.findOneAndUpdate(conditions, update);
      return [err, user];
    } catch (error) {
      err = error;
      return [err, null];
    }
  }
  async deleteUser(conditions) {
    let err = null;
    try {
      const user = await User.deleteById(conditions);
      return [err, user];
    } catch (error) {
      err = error;
      return [err, null];
    }
  }
}
module.exports = UserRepository;
