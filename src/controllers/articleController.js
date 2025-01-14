import express from 'express';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../utils/validation.js';
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from '../services/articleService.js';

export const articleRouter = express.Router();

articleRouter.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const article = await createArticle(req.body);
      res.status(201).json({ message: 'Article created successfully', data: article });
    } catch (error) {
      res.status(500).json({ message: 'Error creating article', error: error.message });
    }
  }
);

articleRouter.get('/', async (req, res) => {
  try {
    const articles = await getAllArticles();
    res.status(200).json({ message: 'List of all articles', data: articles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
});

articleRouter.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid article ID format')],
  handleValidationErrors,
  async (req, res) => {
    try {
      const article = await getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: `Article with ID ${req.params.id} not found` });
      }
      res.status(200).json({ message: 'Article retrieved successfully', data: article });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching article', error: error.message });
    }
  }
);

articleRouter.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid article ID format'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updatedArticle = await updateArticle(req.params.id, req.body);
      if (!updatedArticle) {
        return res.status(404).json({ message: `Article with ID ${req.params.id} not found` });
      }
      res.status(200).json({ message: 'Article updated successfully', data: updatedArticle });
    } catch (error) {
      res.status(500).json({ message: 'Error updating article', error: error.message });
    }
  }
);

articleRouter.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid article ID format')],
  handleValidationErrors,
  async (req, res) => {
    try {
      const deletedArticle = await deleteArticle(req.params.id);
      if (!deletedArticle) {
        return res.status(404).json({ message: `Article with ID ${req.params.id} not found` });
      }
      res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting article', error: error.message });
    }
  }
);
