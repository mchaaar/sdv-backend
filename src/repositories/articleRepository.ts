import { Article, IArticle } from '../models/article.model';

class ArticleRepository {
  initializeArticle(articleData: Partial<IArticle>): IArticle {
    return new Article(articleData);
  }

  async saveArticle(article: IArticle): Promise<IArticle> {
    return await article.save();
  }

  async findArticleById(articleId: string): Promise<IArticle | null> {
    return await Article.findById(articleId);
  }

  async updateArticle(articleId: string, updateData: Partial<IArticle>): Promise<IArticle | null> {
    return await Article.findByIdAndUpdate(articleId, updateData, { new: true });
  }

  async deleteArticle(articleId: string): Promise<IArticle | null> {
    return await Article.findByIdAndDelete(articleId);
  }

  async getAllArticles(): Promise<IArticle[]> {
    return await Article.find({});
  }
}

export default new ArticleRepository();
