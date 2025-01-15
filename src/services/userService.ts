import userRepository from '../repositories/userRepository';
import { logError, logInfo } from './loggerService';
import { UserDTO } from '../dto/user.dto';
import { IUser } from '../types/user.d';

export const createUser = async (userDTO: UserDTO): Promise<IUser> => {
  try {
    logInfo(`Creating user with email: ${userDTO.email}`);
    const existingUser = await userRepository.findUserByEmail(userDTO.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser = await userRepository.createUser(userDTO.toModel());
    logInfo(`User successfully created with ID: ${newUser._id}`);
    return newUser;
  } catch (error: any) {
    logError(`Error creating user: ${error.message}`);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<{ message: string; user: IUser }> => {
  try {
    logInfo(`Logging in user with email: ${email}`);
    const user = await userRepository.findUserByEmail(email);
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    logInfo(`User successfully logged in with ID: ${user._id}`);
    return { message: 'Login successful', user };
  } catch (error: any) {
    logError(`Error during login: ${error.message}`);
    throw error;
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    logInfo('Fetching all users from the database');
    const users = await userRepository.getAllUsers();
    logInfo(`Fetched ${users.length} users`);
    return users;
  } catch (error: any) {
    logError(`Error fetching users: ${error.message}`);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  try {
    logInfo(`Fetching user with ID: ${userId}`);
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  } catch (error: any) {
    logError(`Error fetching user: ${error.message}`);
    throw error;
  }
};

export const updateUser = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  try {
    logInfo(`Updating user with ID: ${userId}`);
    const updatedUser = await userRepository.updateUser(userId, updateData);
    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    logInfo(`User updated successfully with ID: ${userId}`);
    return updatedUser;
  } catch (error: any) {
    logError(`Error updating user: ${error.message}`);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<IUser | null> => {
  try {
    logInfo(`Deleting user with ID: ${userId}`);
    const deletedUser = await userRepository.deleteUser(userId);
    if (!deletedUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    logInfo(`User deleted successfully with ID: ${userId}`);
    return deletedUser;
  } catch (error: any) {
    logError(`Error deleting user: ${error.message}`);
    throw error;
  }
};
