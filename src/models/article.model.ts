import mongoose, { Schema } from 'mongoose';
import { IArticle } from '../types/article';

const ArticleSchema: Schema<IArticle> = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);
