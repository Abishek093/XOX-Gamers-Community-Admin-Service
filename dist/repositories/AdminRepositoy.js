"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const Admin_1 = require("../entities/Admin");
const AdminModel_1 = __importDefault(require("../models/AdminModel"));
const PostModel_1 = __importDefault(require("../models/PostModel"));
const ReportModel_1 = __importDefault(require("../models/ReportModel"));
const UserModel_1 = require("../models/UserModel");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const SponsoredPost_1 = __importDefault(require("../models/SponsoredPost"));
class AdminRepository {
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield AdminModel_1.default.findOne({ email }).exec();
                console.log("admin", admin);
                if (!admin)
                    return null;
                const adminProps = {
                    id: admin._id,
                    email: admin.email,
                    name: admin.name,
                    password: admin.password,
                };
                return new Admin_1.Admin(adminProps);
            }
            catch (error) {
                throw new CustomError_1.default("Error while admin login: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
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
    fetchUsers(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield UserModel_1.UserModel.find({}, 'email username isVerified isGoogleUser isBlocked')
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .exec();
                const total = yield UserModel_1.UserModel.countDocuments();
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
            }
            catch (error) {
                throw new CustomError_1.default("Error while fetching users: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
    }
    blockUnblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("userId", userId);
                const user = yield UserModel_1.UserModel.findById(userId);
                if (!user) {
                    throw new CustomError_1.default('User not found', 404);
                }
                user.isBlocked = !user.isBlocked;
                yield user.save();
                return { id: user.id, isBlocked: user.isBlocked };
            }
            catch (error) {
                throw new CustomError_1.default("Error while Blocking/Unblocking users: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
    }
    fetchReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportedPosts = yield ReportModel_1.default.aggregate([
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
                const results = yield Promise.all(reportedPosts.map((report) => __awaiter(this, void 0, void 0, function* () {
                    const post = yield PostModel_1.default.findById(report._id)
                        .select('title content author')
                        .populate('author', 'username'); // Explicitly define author type
                    return {
                        post: post
                            ? {
                                _id: post._id, // Cast to ObjectId
                                title: post.title,
                                content: post.content,
                                author: {
                                    _id: post.author._id, // Cast to ObjectId
                                    username: post.author.username, // Now this works
                                },
                            }
                            : null, // Handle case where post is not found
                        reportCount: report.reportCount,
                        reports: report.reports,
                    };
                })));
                return results;
            }
            catch (error) {
                throw new CustomError_1.default("Error while fetch reports: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
    }
    resolveReport(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield ReportModel_1.default.find({ targetId: postId, targetType: 'post' });
                if (reports.length === 0) {
                    throw new CustomError_1.default('No reports found for this post', 404);
                }
                yield ReportModel_1.default.updateMany({ targetId: postId, targetType: 'post' }, { status: 'resolved' });
                return reports;
            }
            catch (error) {
                throw new CustomError_1.default("Error while resolving report: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
    }
    deleteReportedPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield ReportModel_1.default.find({ targetId: postId, targetType: 'post' });
                if (reports.length === 0) {
                    throw new CustomError_1.default('No reports found for this post', 404);
                }
                const updateResult = yield ReportModel_1.default.updateMany({ targetId: postId, targetType: 'post' }, { status: 'resolved' });
                const deleteResult = yield PostModel_1.default.findByIdAndDelete(postId);
                return reports;
            }
            catch (error) {
                throw new CustomError_1.default("Error while deleting post: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
    }
    createSponsoredPost(title, imageUrl, link) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPost = new SponsoredPost_1.default({ title, imageUrl, link });
                return newPost;
            }
            catch (error) {
                throw new CustomError_1.default("Error creating sponsored post: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
    }
    getSponsoredPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield SponsoredPost_1.default.find().sort({ createdAt: -1 });
                return posts;
            }
            catch (error) {
                throw new CustomError_1.default("Error creating sponsored post: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
    }
    updateponsoredPosts(id, title, imageUrl, link) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPost = yield SponsoredPost_1.default.findByIdAndUpdate(id, { title, imageUrl, link }, { new: true });
                if (!updatedPost) {
                    throw new CustomError_1.default('No sponsored post found', 404);
                }
                return updatedPost;
            }
            catch (error) {
                throw new CustomError_1.default("Error creating sponsored post: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
    }
    deleteSponsoredPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedPost = yield SponsoredPost_1.default.findByIdAndDelete(id);
                if (!deletedPost) {
                    throw new CustomError_1.default('Sponsored post not found', 404);
                }
            }
            catch (error) {
                throw new CustomError_1.default("Error creating sponsored post: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
