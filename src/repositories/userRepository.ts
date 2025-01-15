import { User, IUser } from '../models/user.model';

class UserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find({});
  }
}

export default new UserRepository();
