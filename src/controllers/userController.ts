import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { UserDTO } from '../dto/user.dto';
import { UserPresenter } from '../presenters/user.presenter';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../services/userService';

import { authenticateToken } from '../middlewares/authMiddleware';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} from '../utils/jwt';
import { handleValidationErrors } from '../utils/validation';
import userRepository from '../repositories/userRepository';

export const userRouter = express.Router();

userRouter.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    handleValidationErrors,
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userDTO = new UserDTO(req.body);
      const hashedPassword = await bcrypt.hash(userDTO.password, 10);
      userDTO.password = hashedPassword;

      const user = await createUser(userDTO);
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(201).json({
        message: 'User registered successfully',
        accessToken,
        refreshToken,
        data: UserPresenter.present(user),
      });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({
        message: 'Error registering user',
        error: err.message,
      });
    }
  }
);

userRouter.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required'),
    handleValidationErrors,
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res
        .status(200)
        .setHeader('Authorization', `Bearer ${accessToken}`)
        .json({
          message: 'Login successful',
          refreshToken,
        });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  }
);

userRouter.get(
  '/me',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }

      const decoded: any = verifyAccessToken(token);
      const user = await userRepository.findUserById(decoded.id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'User information retrieved successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({
        message: 'Error retrieving user information',
        error: err.message,
      });
    }
  }
);

userRouter.post(
  '/refresh-token',
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.headers['refresh-token'] as string;

    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided in headers' });
      return;
    }

    try {
      const decoded: any = verifyRefreshToken(refreshToken);
      const user = await userRepository.findUserById(decoded.id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      res.status(200).json({
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(403).json({ message: 'Invalid or expired refresh token', error: err.message });
    }
  }
);

userRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      message: 'List of all users',
      data: users.map(UserPresenter.present),
    });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({
      message: 'Error fetching users',
      error: err.message,
    });
  }
});

userRouter.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid user ID format')],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await getUserById(req.params.id);

      if (!user) {
        res.status(404).json({ message: `User with ID ${req.params.id} not found` });
        return;
      }

      res.status(200).json({
        message: 'User retrieved successfully',
        data: UserPresenter.present(user),
      });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({
        message: 'Error fetching user',
        error: err.message,
      });
    }
  }
);

userRouter.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid user ID format'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedUser = await updateUser(req.params.id, req.body);

      if (!updatedUser) {
        res.status(404).json({ message: `User with ID ${req.params.id} not found` });
        return;
      }

      res.status(200).json({
        message: 'User updated successfully',
        data: UserPresenter.present(updatedUser),
      });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({
        message: 'Error updating user',
        error: err.message,
      });
    }
  }
);

userRouter.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid user ID format')],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedUser = await deleteUser(req.params.id);

      if (!deletedUser) {
        res.status(404).json({ message: `User with ID ${req.params.id} not found` });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(500).json({
        message: 'Error deleting user',
        error: err.message,
      });
    }
  }
);
