import { NextFunction, Request, Response } from "express";
import { AdminInteractor } from "../interactors/AdminInteractor";

export class AdminController {
    constructor(private interactor: AdminInteractor) { }


    verifyLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password } = req.body;
        try {
            console.log(email, password)
            const authenticatedAdmin = await this.interactor.adminLogin(email, password);
            res.status(200).json(authenticatedAdmin)
        } catch (error) {
            next(error)
        }
    };

    refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { refreshToken } = req.body;
        try {
            const { accessToken, newRefreshToken } = await this.interactor.refreshAccessToken(refreshToken);
            res.status(200).json({ accessToken, refreshToken: newRefreshToken })
        } catch (error: any) {
            next(error)
        }
    };

    // getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const response = await this.interactor.fetchUsers()
    //         res.status(200).json(response)
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1; // default to page 1
            const limit = parseInt(req.query.limit as string, 10) || 10; // default to 10 users per page
            const response = await this.interactor.fetchUsers(page, limit);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
    
    blockUnblockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.params.id;
        try {
            const response = await this.interactor.blockUnblockUser(userId)
            res.status(200).json({ id: response.id, isBlocked: response.isBlocked });
        } catch (error) {
            next(error)
        }
    };

    fetchReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const response = await this.interactor.fetchReports()
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    resolveReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { postId } = req.params;
            const response = await this.interactor.resolveReport(postId)
            res.status(200).json({ message: 'All reports for this post have been resolved', response });
        } catch (error) {
            next(error)
        }
    }

    deleteReportedPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { postId } = req.params;
            const response = await this.interactor.deleteReportedPost(postId)
            res.status(200).json({ message: 'Post deleted and all associated reports have been resolved', response });
        } catch (error) {
            next(error)
        }
    }



    createSponsoredPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { title, imageUrl, link } = req.body;
            const results = await this.interactor.createSponsoredPost(title, imageUrl, link)
            res.status(200).json(results);
        } catch (error) {
            next(error)
        }
    }

    getSponsoredPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const results = await this.interactor.getSponsoredPosts()
            res.status(200).json(results);
        } catch (error) {
            next(error)
        }
    }

    updateSponsoredPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { title, imageUrl, link } = req.body;
            const results = await this.interactor.updateSponsoredPosts(id, title, imageUrl, link)
            res.status(200).json(results);
        } catch (error) {
            next(error)
        }
    }


    deleteSponsoredPost = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.interactor.deleteSponsoredPost(id)
            res.status(200).json({ message: 'Sponsored post deleted successfully' })
        } catch (error) {
            next(error)
        }
    }
}