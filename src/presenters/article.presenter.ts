import { IArticlePresenter } from '../types/presenter';
import { IArticle } from '../types/article';

export class ArticlePresenter {
  static present(article: IArticle): IArticlePresenter {
    return {
      id: article._id.toString(),
      title: article.title,
      content: article.content,
    };
  }
}