import { User } from "../entities/User";

export interface IUserRepository{
    saveUser(userData: User):Promise<void>

}