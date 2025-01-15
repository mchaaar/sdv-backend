import { Document } from 'mongoose';

export interface IArticle {
  _id: string;
  title: string;
  content: string;
}