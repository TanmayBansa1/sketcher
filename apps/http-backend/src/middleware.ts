import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedTokenSchema } from "@repo/commons/authSchemas";

export default async function middleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({
            message: "Token is required",
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedTokenSchema;

    if(!decoded){
        return res.status(401).json({
            message: "Invalid token",
        });
    }

    req.userId = decoded.userId;
    next();
}
    