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
exports.protectAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import UserModel, { IUser } from "../data/UserModel";
const AdminModel_1 = __importDefault(require("../models/AdminModel"));
const protectAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("Authorization");
    // console.log('req.headers',req.headers)
    if (!token || !token.startsWith("Bearer ")) {
        console.log("No token or invalid format");
        // throw new CustomError("Not authorized, no token or invalid format", 401)
        res.status(401).json({ message: "Not authorized, no token or invalid format" });
        return;
    }
    try {
        const tokenWithoutBearer = token.replace("Bearer ", "").trim();
        console.log("Token without Bearer:", tokenWithoutBearer);
        const secretKey = process.env.JWT_SECRET_KEY || "";
        const decoded = jsonwebtoken_1.default.verify(tokenWithoutBearer, secretKey);
        console.log({ decoded });
        if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
            const userId = decoded.userId;
            const user = yield AdminModel_1.default.findById(userId);
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            req.locals = { user };
            next();
        }
        else {
            throw new Error('Invalid token format');
        }
    }
    catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Not authorized, invalid token" });
    }
});
exports.protectAdmin = protectAdmin;
