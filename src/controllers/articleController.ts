import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { ArticleDTO } from '../dto/article.dto';
import { ArticlePresenter } from '../presenters/article.presenter';
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from '../services/articleService';

export const articleRouter = express.Router();

/**
 * Create a new article
 */
articleRouter.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const articleDTO = new ArticleDTO(req.body);
      const article = await createArticle(articleDTO);

      res.status(201).json({
        message: 'Article created successfully',
        data: ArticlePresenter.present(article),
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Error creating article',
        error: error.message,
      });
    }
  }
);

/**
 * Get all articles
 */
articleRouter.get('/', async (req: Request, res: Response) => {
  try {
    const articles = await getAllArticles();

    res.status(200).json({
      message: 'List of all articles',
      data: articles.map(ArticlePresenter.present),
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error fetching articles',
      error: error.message,
    });
  }
});

/**
 * Get a specific article by ID
 */
articleRouter.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid article ID format')],
  async (req: Request, res: Response) => {
    try {
      const article = await getArticleById(req.params.id);

      if (!article) {
        res.status(404).json({
          message: `Article with ID ${req.params.id} not found`,
        });
        return;
      }

      res.status(200).json({
        message: 'Article retrieved successfully',
        data: ArticlePresenter.present(article),
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Error fetching article',
        error: error.message,
      });
    }
  }
);

/**
 * Update an article by ID
 */
articleRouter.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid article ID format'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  ],
  async (req: Request, res: Response) => {
    try {
      const updatedArticle = await updateArticle(req.params.id, req.body);

      if (!updatedArticle) {
        res.status(404).json({
          message: `Article with ID ${req.params.id} not found`,
        });
        return;
      }

      res.status(200).json({
        message: 'Article updated successfully',
        data: ArticlePresenter.present(updatedArticle),
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Error updating article',
        error: error.message,
      });
    }
  }
);

/**
 * Delete an article by ID
 */
articleRouter.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid article ID format')],
  async (req: Request, res: Response) => {
    try {
      const deletedArticle = await deleteArticle(req.params.id);

      if (!deletedArticle) {
        res.status(404).json({
          message: `Article with ID ${req.params.id} not found`,
        });
        return;
      }

      res.status(200).json({
        message: 'Article deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Error deleting article',
        error: error.message,
      });
    }
  }
);
