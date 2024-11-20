import mongoose from "mongoose";
import { Admin, AdminProps } from "../entities/Admin";
import { FetchReportsResponse, ReportedPostResult, SimplifiedUser } from "../entities/Types";
import { IAdminRepositroy } from "../interfaces/IAdminRepository";
import AdminModel from "../models/AdminModel";
import PostModel from "../models/PostModel";
import ReportModel, { IReport } from "../models/ReportModel";
import { IUser, UserModel } from "../models/UserModel";
import CustomError from "../utils/CustomError";
import SponsoredPost, { ISponsoredPost } from "../models/SponsoredPost";

export class AdminRepository implements IAdminRepositroy {
    async findAdminByEmail(email: string): Promise<Admin | null> {
        try {
            const admin = await AdminModel.findOne({ email }).exec();
            console.log("admin", admin)
            if (!admin) return null;

            const adminProps: AdminProps = {
                id: (admin._id as unknown as string),
                email: admin.email,
                name: admin.name,
                password: admin.password,
            };

            return new Admin(adminProps);

        } catch (error) {
            throw new CustomError("Error while admin login: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
        }
    }

    // async fetchUsers(): Promise<SimplifiedUser[]> {
    //     try {
    //         const users = await UserModel.find({}, 'email username isVerified isGoogleUser isBlocked').exec();
    //         const simplifiedUsers = users.map(user => ({
    //             _id: user.id,
    //             email: user.email,
    //             username: user.username,
    //             isVerified: user.isVerified,
    //             isGoogleUser: user.isGoogleUser,
    //             isBlocked: user.isBlocked
    //         }));

    //         return simplifiedUsers

    //     } catch (error) {
    //         throw new CustomError("Error while fetching users: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
    //     }
    // }

    async fetchUsers(page: number, limit: number): Promise<{ users: SimplifiedUser[], total: number }> {
        try {
            const users = await UserModel.find({}, 'email username isVerified isGoogleUser isBlocked')
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
            const total = await UserModel.countDocuments();
    
            return {
                users: users.map(user => ({
                    _id: user.id,
                    email: user.email,
                    username: user.username,
                    isVerified: user.isVerified,
                    isGoogleUser: user.isGoogleUser,
                    isBlocked: user.isBlocked
                })),
                total
            };
        } catch (error) {
            throw new CustomError("Error while fetching users: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
        }
    }
    

    async blockUnblockUser(userId: string): Promise<{ id: string, isBlocked: boolean }> {
        try {
            console.log("userId",userId)
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new CustomError('User not found', 404)
            }
            user.isBlocked = !user.isBlocked;
            await user.save();

            return { id: user.id, isBlocked: user.isBlocked }
        } catch (error) {
            throw new CustomError("Error while Blocking/Unblocking users: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
        }
    }

    async fetchReports(): Promise<FetchReportsResponse> {
        try {
            const reportedPosts = await ReportModel.aggregate([
                {
                    $match: {
                        targetType: 'post',
                        status: 'pending'
                    }
                },
                {
                    $group: {
                        _id: '$targetId',
                        reportCount: { $sum: 1 },
                        reports: { $push: '$$ROOT' }
                    }
                },
                {
                    $match: { reportCount: { $gt: 2 } }
                }
            ]);

            const results: FetchReportsResponse = await Promise.all(
                reportedPosts.map(async (report): Promise<ReportedPostResult> => {
                    const post = await PostModel.findById(report._id)
                        .select('title content author')
                        .populate<{ author: IUser }>('author', 'username'); // Explicitly define author type

                    return {
                        post: post
                            ? {
                                _id: post._id as mongoose.Types.ObjectId, // Cast to ObjectId
                                title: post.title,
                                content: post.content,
                                author: {
                                    _id: post.author._id as mongoose.Types.ObjectId, // Cast to ObjectId
                                    username: post.author.username, // Now this works
                                },
                            }
                            : null, // Handle case where post is not found
                        reportCount: report.reportCount,
                        reports: report.reports,
                    };
                })
            );


            return results;
        } catch (error) {
            throw new CustomError("Error while fetch reports: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
        }
    }

    async resolveReport(postId: string): Promise<IReport[]> {
        try {
            const reports = await ReportModel.find({ targetId: postId, targetType: 'post' });

            if (reports.length === 0) {
                throw new CustomError('No reports found for this post', 404)
            }

            await ReportModel.updateMany({ targetId: postId, targetType: 'post' }, { status: 'resolved' });
            return reports

        } catch (error) {
            throw new CustomError("Error while resolving report: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
        }
    }

    async deleteReportedPost(postId: string): Promise<IReport[]> {
        try {
            const reports = await ReportModel.find({ targetId: postId, targetType: 'post' });
            if (reports.length === 0) {
                throw new CustomError('No reports found for this post', 404)
            }
            const updateResult = await ReportModel.updateMany({ targetId: postId, targetType: 'post' }, { status: 'resolved' });

            const deleteResult = await PostModel.findByIdAndDelete(postId);

            return reports
        } catch (error) {
            throw new CustomError("Error while deleting post: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
        }
    }

    async createSponsoredPost( title:string, imageUrl:string, link:string ):Promise<ISponsoredPost>{
        try {
            const newPost = new SponsoredPost({ title, imageUrl, link });
            return newPost
        } catch (error) {
            throw new CustomError("Error creating sponsored post: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
        }
    }

    async getSponsoredPosts():Promise<ISponsoredPost[]>{
        try {
            const posts = await SponsoredPost.find().sort({ createdAt: -1 });
            return posts
        } catch (error) {
            throw new CustomError("Error creating sponsored post: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
        }
    }

    async updateponsoredPosts(id: string, title: string, imageUrl: string, link:string):Promise<ISponsoredPost>{
        try {
            const updatedPost = await SponsoredPost.findByIdAndUpdate(
                id,
                { title, imageUrl, link },
                { new: true }
              );

              if (!updatedPost) {
                throw new CustomError('No sponsored post found', 404)
              }
            return updatedPost
        } catch (error) {
            throw new CustomError("Error creating sponsored post: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
        }
    }

    async deleteSponsoredPost(id: string):Promise<void>{
        try {
            const deletedPost = await SponsoredPost.findByIdAndDelete(id);
            if (!deletedPost) {
                throw new CustomError('Sponsored post not found', 404)
            }
        } catch (error) {
            throw new CustomError("Error creating sponsored post: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
        }
    }
}