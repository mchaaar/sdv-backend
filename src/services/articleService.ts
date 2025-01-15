import articleRepository from '../repositories/articleRepository';
import { logError, logInfo } from './loggerService';
import { ArticleDTO } from '../dto/article.dto';
import { IArticle } from '../types/article.d';

export const createArticle = async (articleDTO: ArticleDTO): Promise<IArticle> => {
  try {
    logInfo(`Creating article with title: ${articleDTO.title}`);
    const article = articleRepository.initializeArticle(articleDTO.toModel());
    const savedArticle = await articleRepository.saveArticle(article);
    logInfo(`Article created successfully with ID: ${savedArticle._id}`);
    return savedArticle;
  } catch (error: any) {
    logError(`Error creating article: ${error.message}`);
    throw error;
  }
};

export const getAllArticles = async (): Promise<IArticle[]> => {
  try {
    logInfo('Fetching all articles');
    const articles = await articleRepository.getAllArticles();
    logInfo(`Fetched ${articles.length} articles`);
    return articles;
  } catch (error: any) {
    logError(`Error fetching articles: ${error.message}`);
    throw error;
  }
};

export const getArticleById = async (articleId: string): Promise<IArticle | null> => {
  try {
    logInfo(`Fetching article with ID: ${articleId}`);
    const article = await articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error(`Article with ID ${articleId} not found`);
    }
    return article;
  } catch (error: any) {
    logError(`Error fetching article: ${error.message}`);
    throw error;
  }
};

export const updateArticle = async (articleId: string, updateData: Partial<IArticle>): Promise<IArticle | null> => {
  try {
    logInfo(`Updating article with ID: ${articleId}`);
    const updatedArticle = await articleRepository.updateArticle(articleId, updateData);
    if (!updatedArticle) {
      throw new Error(`Article with ID ${articleId} not found`);
    }
    logInfo(`Article updated successfully with ID: ${articleId}`);
    return updatedArticle;
  } catch (error: any) {
    logError(`Error updating article: ${error.message}`);
    throw error;
  }
};

export const deleteArticle = async (articleId: string): Promise<IArticle | null> => {
  try {
    logInfo(`Deleting article with ID: ${articleId}`);
    const deletedArticle = await articleRepository.deleteArticle(articleId);
    if (!deletedArticle) {
      throw new Error(`Article with ID ${articleId} not found`);
    }
    logInfo(`Article deleted successfully with ID: ${articleId}`);
    return deletedArticle;
  } catch (error: any) {
    logError(`Error deleting article: ${error.message}`);
    throw error;
  }
};
