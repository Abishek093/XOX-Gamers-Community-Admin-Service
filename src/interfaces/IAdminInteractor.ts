import { AuthenticatedAdmin } from "../entities/Admin";
import { FetchReportsResponse, SimplifiedUser } from "../entities/Types";
import { IReport } from "../models/ReportModel";
import { ISponsoredPost } from "../models/SponsoredPost";

export interface IAdminInteractor{
    adminLogin(email: string, password: string): Promise<AuthenticatedAdmin>
    refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; newRefreshToken: string }>
    fetchUsers(page: number, limit: number): Promise<{ users: SimplifiedUser[]; total: number }>;
    blockUnblockUser(userId: string): Promise<{ id: string, isBlocked: boolean }>
    fetchReports():Promise<FetchReportsResponse>
    resolveReport(postId: string):Promise<IReport[]>
    deleteReportedPost(postId: string):Promise<IReport[]>
    createSponsoredPost(title:string, imageUrl:string, link:string): Promise<ISponsoredPost>
    getSponsoredPosts():Promise<ISponsoredPost[]>
    updateSponsoredPosts(id: string, title: string, imageUrl: string, link:string):Promise<ISponsoredPost>
    deleteSponsoredPost(id: string): Promise<void>

}