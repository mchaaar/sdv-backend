import express from 'express';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../utils/validation.js';
import {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../services/userService.js';

export const userRouter = express.Router();

userRouter.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const user = await createUser(req.body);
      res.status(201).json({ message: 'User registered successfully', data: user });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }
);

userRouter.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const response = await loginUser(req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  }
);

userRouter.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ message: 'List of all users', data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

userRouter.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid user ID format')],
  handleValidationErrors,
  async (req, res) => {
    try {
      const user = await getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: `User with ID ${req.params.id} not found` });
      }
      res.status(200).json({ message: 'User retrieved successfully', data: user });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  }
);

userRouter.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid user ID format'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updatedUser = await updateUser(req.params.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: `User with ID ${req.params.id} not found` });
      }
      res.status(200).json({ message: 'User updated successfully', data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  }
);

userRouter.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid user ID format')],
  handleValidationErrors,
  async (req, res) => {
    try {
      const deletedUser = await deleteUser(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: `User with ID ${req.params.id} not found` });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
);
