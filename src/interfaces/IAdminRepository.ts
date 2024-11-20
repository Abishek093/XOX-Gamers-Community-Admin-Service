import { Admin } from "../entities/Admin";
import { FetchReportsResponse, SimplifiedUser } from "../entities/Types";
import { IPost } from "../models/PostModel";
import { IReport } from "../models/ReportModel";
import { ISponsoredPost } from "../models/SponsoredPost";

export interface IAdminRepositroy {
    findAdminByEmail(email: string): Promise<Admin | null>
    // fetchUsers(): Promise<SimplifiedUser[]>
    fetchUsers(page: number, limit: number): Promise<{ users: SimplifiedUser[], total: number }>
    blockUnblockUser(userId: string): Promise<{ id: string, isBlocked: boolean }>
    fetchReports(): Promise<FetchReportsResponse>
    resolveReport(postId: string): Promise<IReport[]>
    deleteReportedPost(postId: string): Promise<IReport[]>
    createSponsoredPost( title:string, imageUrl:string, link:string ):Promise<ISponsoredPost>
    getSponsoredPosts():Promise<ISponsoredPost[]>
    updateponsoredPosts(id: string, title: string, imageUrl: string, link:string):Promise<ISponsoredPost>
    deleteSponsoredPost(id: string):Promise<void>
}