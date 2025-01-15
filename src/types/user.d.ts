import { Document } from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
}

