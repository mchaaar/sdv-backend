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
import { authenticateToken } from '../middlewares/authMiddleware';

export const articleRouter = express.Router();

articleRouter.post(
  '/',
  authenticateToken,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
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

articleRouter.get('/', async (req: Request, res: Response): Promise<void> => {
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

articleRouter.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid article ID format')],
  async (req: Request, res: Response): Promise<void> => {
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

articleRouter.put(
  '/:id',
  authenticateToken,
  [
    param('id').isMongoId().withMessage('Invalid article ID format'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  ],
  async (req: Request, res: Response): Promise<void> => {
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

articleRouter.delete(
  '/:id',
  authenticateToken,
  [param('id').isMongoId().withMessage('Invalid article ID format')],
  async (req: Request, res: Response): Promise<void> => {
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
