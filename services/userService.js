const UserRepository = require("../repositories/userRepository");
const userRepository = new UserRepository();

class UserService {
  async createUser(payload) {
    const conditions = payload.body;
    return await userRepository.createUser(conditions);
  }
  async viewUser(payload) {
    return await userRepository.viewUser(payload);
  }
  async editUser(payload) {
    const conditions = { _id: payload.params.id };
    const update = payload.body;
    return await userRepository.editUser(conditions, update);
  }
  async deleteUser(payload) {
    const conditions = { _id: payload.params.id };
    return await userRepository.deleteUser(conditions);
  }
}

module.exports = UserService;
