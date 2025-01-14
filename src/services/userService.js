import userRepository from '../repositories/userRepository.js';
import { logError, logInfo } from './loggerService.js';

export const createUser = async (userData) => {
  try {
    logInfo(`Attempting to create a user with email: ${userData.email}`);
    const existingUser = await userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const newUser = await userRepository.createUser(userData);
    logInfo(`User successfully created with ID: ${newUser._id}`);
    return newUser;
  } catch (error) {
    logError(`Error creating user: ${error.message}`);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    logInfo(`Attempting to log in with email: ${credentials.email}`);
    const user = await userRepository.findUserByEmail(credentials.email);
    if (!user || user.password !== credentials.password) {
      logError('Invalid email or password');
      throw new Error('Invalid email or password');
    }
    logInfo(`User successfully logged in with ID: ${user._id}`);
    return { message: 'Login successful', user };
  } catch (error) {
    logError(`Error logging in: ${error.message}`);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    logInfo('Fetching all users from the database');
    const users = await userRepository.getAllUsers();
    logInfo(`Fetched ${users.length} users`);
    return users;
  } catch (error) {
    logError(`Error fetching users: ${error.message}`);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    logInfo(`Fetching user with ID: ${userId}`);
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  } catch (error) {
    logError(`Error fetching user: ${error.message}`);
    throw error;
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    logInfo(`Attempting to update user with ID: ${userId}`);
    const updatedUser = await userRepository.updateUser(userId, updateData);
    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    logInfo(`User successfully updated with ID: ${userId}`);
    return updatedUser;
  } catch (error) {
    logError(`Error updating user: ${error.message}`);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    logInfo(`Attempting to delete user with ID: ${userId}`);
    const deletedUser = await userRepository.deleteUser(userId);
    if (!deletedUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    logInfo(`User successfully deleted with ID: ${userId}`);
    return deletedUser;
  } catch (error) {
    logError(`Error deleting user: ${error.message}`);
    throw error;
  }
};
