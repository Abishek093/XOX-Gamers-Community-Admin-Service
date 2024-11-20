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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
class AdminController {
    constructor(interactor) {
        this.interactor = interactor;
        this.verifyLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                console.log(email, password);
                const authenticatedAdmin = yield this.interactor.adminLogin(email, password);
                res.status(200).json(authenticatedAdmin);
            }
            catch (error) {
                next(error);
            }
        });
        this.refreshAccessToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            try {
                const { accessToken, newRefreshToken } = yield this.interactor.refreshAccessToken(refreshToken);
                res.status(200).json({ accessToken, refreshToken: newRefreshToken });
            }
            catch (error) {
                next(error);
            }
        });
        // getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        //     try {
        //         const response = await this.interactor.fetchUsers()
        //         res.status(200).json(response)
        //     } catch (error) {
        //         next(error)
        //     }
        // }
        this.getUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page, 10) || 1; // default to page 1
                const limit = parseInt(req.query.limit, 10) || 10; // default to 10 users per page
                const response = yield this.interactor.fetchUsers(page, limit);
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.blockUnblockUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const response = yield this.interactor.blockUnblockUser(userId);
                res.status(200).json({ id: response.id, isBlocked: response.isBlocked });
            }
            catch (error) {
                next(error);
            }
        });
        this.fetchReports = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.fetchReports();
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.resolveReport = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const response = yield this.interactor.resolveReport(postId);
                res.status(200).json({ message: 'All reports for this post have been resolved', response });
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteReportedPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const response = yield this.interactor.deleteReportedPost(postId);
                res.status(200).json({ message: 'Post deleted and all associated reports have been resolved', response });
            }
            catch (error) {
                next(error);
            }
        });
        this.createSponsoredPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, imageUrl, link } = req.body;
                const results = yield this.interactor.createSponsoredPost(title, imageUrl, link);
                res.status(200).json(results);
            }
            catch (error) {
                next(error);
            }
        });
        this.getSponsoredPosts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield this.interactor.getSponsoredPosts();
                res.status(200).json(results);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateSponsoredPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { title, imageUrl, link } = req.body;
                const results = yield this.interactor.updateSponsoredPosts(id, title, imageUrl, link);
                res.status(200).json(results);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteSponsoredPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.interactor.deleteSponsoredPost(id);
                res.status(200).json({ message: 'Sponsored post deleted successfully' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminController = AdminController;
