import User from '../models/user.model.js';

class UserRepository {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findUserById(userId) {
    return await User.findById(userId);
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async getAllUsers() {
    return await User.find({});
  }
}

export default new UserRepository();
