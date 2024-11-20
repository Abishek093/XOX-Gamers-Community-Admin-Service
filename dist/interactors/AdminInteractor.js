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
exports.AdminInteractor = void 0;
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
class AdminInteractor {
    constructor(repository, broker) {
        this.broker = broker;
        this.repository = repository;
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingAdmin = yield this.repository.findAdminByEmail(email);
                if (existingAdmin) {
                    console.log(bcryptjs_1.default.compareSync(password, existingAdmin.password));
                }
                else {
                    console.log('existing admin not found');
                }
                if (!existingAdmin || !bcryptjs_1.default.compareSync(password, existingAdmin.password)) {
                    throw new Error('Invalid credentials');
                }
                const { accessToken, refreshToken } = (0, jwt_1.generateToken)(existingAdmin.id);
                const admin = {
                    id: existingAdmin.id,
                    name: existingAdmin.name,
                    email: existingAdmin.email
                };
                return { admin, accessToken, refreshToken };
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
    }
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
                const { accessToken, refreshToken: newRefreshToken } = (0, jwt_1.generateToken)(decoded.userId);
                return { accessToken, newRefreshToken };
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
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
    fetchUsers(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.fetchUsers(page, limit);
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
    }
    blockUnblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield this.repository.blockUnblockUser(userId);
                yield this.broker.publishUserBlockedMessage(results);
                return results;
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
    }
    fetchReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.fetchReports();
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
    }
    resolveReport(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.resolveReport(postId);
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
    }
    deleteReportedPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.deleteReportedPost(postId);
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
    }
    createSponsoredPost(title, imageUrl, link) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.createSponsoredPost(title, imageUrl, link);
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
    }
    getSponsoredPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getSponsoredPosts();
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
    }
    updateSponsoredPosts(id, title, imageUrl, link) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.updateponsoredPosts(id, title, imageUrl, link);
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
    }
    deleteSponsoredPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.deleteSponsoredPost(id);
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                else {
                    console.error(error);
                    throw new CustomError_1.default("Internal Server Error", 500);
                }
            }
        });
    }
}
exports.AdminInteractor = AdminInteractor;
