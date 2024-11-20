import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../entities/User'; 

export interface IUser extends Document {
  email: string;
  username: string;
  displayName: string;
  dateOfBirth: Date;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  isGoogleUser: boolean;
  isBlocked: boolean;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  displayName: { type: String },
  dateOfBirth: { type: Date },
  profileImage: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  isGoogleUser: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }
});

// Exporting the User model directly
export const UserModel = mongoose.model<IUser>('User', UserSchema);

// Utility function to map user document to entity
export class UserMapper {
  public static mapToEntity(userDoc: IUser): User {
    return new User(
      String(userDoc._id),
      userDoc.username,
      userDoc.email,
      userDoc.createdAt,
      userDoc.updatedAt,
      userDoc.isVerified,
      userDoc.isGoogleUser,
      userDoc.isBlocked,
      userDoc.profileImage,
      userDoc.bio,
      userDoc.dateOfBirth,
    );
  }
  
}
