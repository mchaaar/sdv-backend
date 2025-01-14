import Article from '../models/article.model.js';

class ArticleRepository {
  initializeArticle(articleData) {
    return new Article(articleData);
  }

  async saveArticle(article) {
    return await article.save();
  }

  async findArticleById(articleId) {
    return await Article.findById(articleId);
  }

  async updateArticle(articleId, updateData) {
    return await Article.findByIdAndUpdate(articleId, updateData, { new: true });
  }

  async deleteArticle(articleId) {
    return await Article.findByIdAndDelete(articleId);
  }

  async getAllArticles() {
    return await Article.find({});
  }
}

export default new ArticleRepository();
