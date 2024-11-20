import { User } from "../entities/User";
import { IUserRepository } from "../interfaces/IUserRepository";
import { UserModel } from "../models/UserModel";
import CustomError from "../utils/CustomError";

export class UserRepository implements IUserRepository {
    async saveUser(userData: User): Promise<void> {
        try {
            const newUser = new UserModel(userData);
            await newUser.save();
        } catch (error) {
            throw new CustomError("Error saving user: " + (error instanceof Error ? error.message : "Unknown error"), 500);
        }
    }
}