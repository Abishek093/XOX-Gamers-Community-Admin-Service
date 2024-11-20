import mongoose from "mongoose";
import { IReport } from "../models/ReportModel";
import exp from "constants";

export interface SimplifiedUser {
    _id: string;
    email: string;
    username: string;
    isVerified: boolean;
    isGoogleUser: boolean;
    isBlocked: boolean;
}

export type ReportedPostResult = {
    post: {
        _id: mongoose.Types.ObjectId;
        title: string;
        content: string;
        author: {
            _id: mongoose.Types.ObjectId;
            username: string;
        };
    } | null; // If the post is not found, it can be null.
    reportCount: number;
    reports: IReport[];
};


export type FetchReportsResponse = ReportedPostResult[];


export interface ResolveReportResult {
    message: string;
    reports: IReport[];
  }


export interface isBlockedStatus{ id: string; isBlocked: boolean; }