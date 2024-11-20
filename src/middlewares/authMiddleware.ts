
import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
// import UserModel, { IUser } from "../data/UserModel";
import AdminModel,{IAdmin} from "../models/AdminModel";
import CustomError from "../utils/CustomError";
export const protectAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    // console.log("Token without Bearer:", tokenWithoutBearer);

    const secretKey: string = process.env.JWT_SECRET_KEY || "";
    const decoded = jwt.verify(tokenWithoutBearer, secretKey) as JwtPayload & { userId: string };
    console.log({ decoded });

    if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
      const userId = decoded.userId;
      const user: IAdmin | null = await AdminModel.findById(userId);
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }
      (req as any).locals = { user };
      next();
    } else {
      throw new Error('Invalid token format');
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
