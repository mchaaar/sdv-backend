import articleRepository from '../repositories/articleRepository.js';
import { logError, logInfo } from './loggerService.js';

export const createArticle = async (articleData) => {
  try {
    logInfo(`Attempting to create an article with title: ${articleData.title}`);
    const initializedArticle = articleRepository.initializeArticle(articleData);
    logInfo(`Article successfully initialized`);
    const createdArticle = await articleRepository.saveArticle(initializedArticle);
    logInfo(`Article successfully created with ID: ${createdArticle._id}`);
    return createdArticle;
  } catch (error) {
    logError(`Error creating article: ${error.message}`);
    throw error;
  }
};

export const getAllArticles = async () => {
  try {
    logInfo('Fetching all articles from the database');
    const articles = await articleRepository.getAllArticles();
    logInfo(`Fetched ${articles.length} articles`);
    return articles;
  } catch (error) {
    logError(`Error fetching articles: ${error.message}`);
    throw error;
  }
};

export const getArticleById = async (articleId) => {
  try {
    logInfo(`Fetching article with ID: ${articleId}`);
    const article = await articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error(`Article with ID ${articleId} not found`);
    }
    return article;
  } catch (error) {
    logError(`Error fetching article: ${error.message}`);
    throw error;
  }
};

export const updateArticle = async (articleId, updateData) => {
  try {
    logInfo(`Attempting to update article with ID: ${articleId}`);
    const updatedArticle = await articleRepository.updateArticle(articleId, updateData);
    if (!updatedArticle) {
      throw new Error(`Article with ID ${articleId} not found`);
    }
    logInfo(`Article successfully updated with ID: ${articleId}`);
    return updatedArticle;
  } catch (error) {
    logError(`Error updating article: ${error.message}`);
    throw error;
  }
};

export const deleteArticle = async (articleId) => {
  try {
    logInfo(`Attempting to delete article with ID: ${articleId}`);
    const deletedArticle = await articleRepository.deleteArticle(articleId);
    if (!deletedArticle) {
      throw new Error(`Article with ID ${articleId} not found`);
    }
    logInfo(`Article successfully deleted with ID: ${articleId}`);
    return deletedArticle;
  } catch (error) {
    logError(`Error deleting article: ${error.message}`);
    throw error;
  }
};
