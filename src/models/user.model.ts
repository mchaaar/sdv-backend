import mongoose, { Schema, Document, Model } from 'mongoose';
import type { IUser } from '../types/user.d';

export interface IUserModel extends IUser {}

const UserSchema: Schema<IUserModel> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

export const User: Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);

export { IUser };
