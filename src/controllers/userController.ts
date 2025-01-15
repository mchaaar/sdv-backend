import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { UserDTO } from '../dto/user.dto';
import { UserPresenter } from '../presenters/user.presenter';
import {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../services/userService';

export const userRouter = express.Router();

/**
 * Register a new user
 */
userRouter.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const userDTO = new UserDTO(req.body);
      const user = await createUser(userDTO);

      res
        .status(201)
        .json({
          message: 'User registered successfully',
          data: UserPresenter.present(user),
        });
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: 'Error registering user',
          error: error.message,
        });
    }
  }
);

/**
 * Login a user
 */
userRouter.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const response = await loginUser(email, password);

      res
        .status(200)
        .json({
          message: response.message,
          data: UserPresenter.present(response.user),
        });
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: 'Error logging in',
          error: error.message,
        });
    }
  }
);

/**
 * Get all users
 */
userRouter.get('/', async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    res
      .status(200)
      .json({
        message: 'List of all users',
        data: users.map(UserPresenter.present),
      });
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: 'Error fetching users',
        error: error.message,
      });
  }
});

/**
 * Get a user by ID
 */
userRouter.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid user ID format')],
  async (req: Request, res: Response) => {
    try {
      const user = await getUserById(req.params.id);

      if (!user) {
        res
          .status(404)
          .json({ message: `User with ID ${req.params.id} not found` });
        return;
      }

      res
        .status(200)
        .json({
          message: 'User retrieved successfully',
          data: UserPresenter.present(user),
        });
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: 'Error fetching user',
          error: error.message,
        });
    }
  }
);

/**
 * Update a user
 */
userRouter.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid user ID format'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  ],
  async (req: Request, res: Response) => {
    try {
      const updatedUser = await updateUser(req.params.id, req.body);

      if (!updatedUser) {
        res
          .status(404)
          .json({ message: `User with ID ${req.params.id} not found` });
        return;
      }

      res
        .status(200)
        .json({
          message: 'User updated successfully',
          data: UserPresenter.present(updatedUser),
        });
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: 'Error updating user',
          error: error.message,
        });
    }
  }
);

/**
 * Delete a user
 */
userRouter.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid user ID format')],
  async (req: Request, res: Response) => {
    try {
      const deletedUser = await deleteUser(req.params.id);

      if (!deletedUser) {
        res
          .status(404)
          .json({ message: `User with ID ${req.params.id} not found` });
        return;
      }

      res
        .status(200)
        .json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: 'Error deleting user',
          error: error.message,
        });
    }
  }
);
