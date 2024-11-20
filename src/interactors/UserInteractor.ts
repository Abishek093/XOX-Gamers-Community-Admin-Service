import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import CustomError from "../utils/CustomError";

export class UserInteractor{
    constructor(private repository: UserRepository){}

    async createUser(userData: User): Promise<void> {
        try {
          await this.repository.saveUser(userData)
        } catch (error) {
          if (error instanceof CustomError) {
            throw error;
          } else {
            console.error(error);
            throw new CustomError("Internal Server Error", 500);
          }
        }
      }
}