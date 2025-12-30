// src/users/interfaces/user.interface.ts
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: 'admin' | 'host' | 'security';
  name: string;
  department?: string;
  profileImage?: string;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'host' | 'security';
