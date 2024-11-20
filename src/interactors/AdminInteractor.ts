import { AuthenticatedAdmin } from "../entities/Admin";
import { IAdminInteractor } from "../interfaces/IAdminInteractor";
import { AdminRepository } from "../repositories/AdminRepositoy";
import CustomError from "../utils/CustomError";
import bcrypt from 'bcryptjs'
import { generateToken, verifyRefreshToken } from "../utils/jwt";
import { FetchReportsResponse, SimplifiedUser } from "../entities/Types";
import ReportModel, { IReport } from "../models/ReportModel";
import PostModel from "../models/PostModel";
import { ISponsoredPost } from "../models/SponsoredPost";
import { IMessageBroker } from "../interfaces/IMessageBroker";
import { IAdminRepositroy } from "../interfaces/IAdminRepository";


export class AdminInteractor implements IAdminInteractor {
    private repository: IAdminRepositroy;
    private broker: IMessageBroker;

    constructor(repository: IAdminRepositroy, broker: IMessageBroker) { 
        this.broker = broker;
        this.repository = repository;
    }

    async adminLogin(email: string, password: string): Promise<AuthenticatedAdmin> {
        try {
            const existingAdmin = await this.repository.findAdminByEmail(email);
            if (existingAdmin) {
                console.log(bcrypt.compareSync(password, existingAdmin.password))
            } else {
                console.log('existing admin not found')
            }
            if (!existingAdmin || !bcrypt.compareSync(password, existingAdmin.password)) {
                throw new Error('Invalid credentials');
            }
            const { accessToken, refreshToken } = generateToken(existingAdmin.id);
            const admin = {
                id: existingAdmin.id,
                name: existingAdmin.name,
                email: existingAdmin.email
            };
            return { admin, accessToken, refreshToken };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error(error);
                throw new CustomError("Internal Server Error", 500);
            }
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; newRefreshToken: string }> {
        try {
            const decoded = verifyRefreshToken(refreshToken);
            const { accessToken, refreshToken: newRefreshToken } = generateToken(decoded.userId);
            return { accessToken, newRefreshToken };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error(error);
                throw new CustomError("Internal Server Error", 500);
            }
        }
    }


    // async fetchUsers(): Promise<SimplifiedUser[]> {
    //     try {
    //         return await this.repository.fetchUsers()
    //     } catch (error) {
    //         if (error instanceof CustomError) {
    //             throw error;
    //         } else {
    //             console.error(error);
    //             throw new CustomError("Internal Server Error", 500);
    //         }
    //     }
    // }
    async fetchUsers(page: number, limit: number): Promise<{ users: SimplifiedUser[], total: number }> {
        try {
            return await this.repository.fetchUsers(page, limit);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error(error);
                throw new CustomError("Internal Server Error", 500);
            }
        }
    }

    
    async blockUnblockUser(userId: string): Promise<{ id: string, isBlocked: boolean }> {
        try {
            const results = await this.repository.blockUnblockUser(userId)
            await this.broker.publishUserBlockedMessage(results)
            return results
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error(error);
                throw new CustomError("Internal Server Error", 500);
            }
        }
    }

    async fetchReports(): Promise<FetchReportsResponse> {
        try {
            return await this.repository.fetchReports()
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error(error);
                throw new CustomError("Internal Server Error", 500);
            }
        }
    }

    async resolveReport(postId: string): Promise<IReport[]> {
        try {
            return await this.repository.resolveReport(postId)
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error(error);
                throw new CustomError("Internal Server Error", 500);
            }
        }
    }

    async deleteReportedPost(postId: string): Promise<IReport[]> {
        try {
            return await this.repository.deleteReportedPost(postId)
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error(error);
                throw new CustomError("Internal Server Error", 500);
            }
        }
    }

    async createSponsoredPost(title:string, imageUrl:string, link:string): Promise<ISponsoredPost> {
        try {
            return await this.repository.createSponsoredPost(title, imageUrl, link)
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error(error);
                throw new CustomError("Internal Server Error", 500);
            }
        }
    }

    async getSponsoredPosts(): Promise<ISponsoredPost[]> {
        try {
            return await this.repository.getSponsoredPosts()
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error(error);
                throw new CustomError("Internal Server Error", 500);
            }
        }
    }

    async updateSponsoredPosts(id: string, title: string, imageUrl: string, link:string): Promise<ISponsoredPost> {
        try {
            return await this.repository.updateponsoredPosts(id, title, imageUrl, link)
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error(error);
                throw new CustomError("Internal Server Error", 500);
            }
        }
    }

    async deleteSponsoredPost(id: string): Promise<void> {
        try {
            await this.repository.deleteSponsoredPost(id)
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