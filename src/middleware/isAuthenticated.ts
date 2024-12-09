import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export default function isAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization?.split('Bearer ')[1];
    const secret = process.env.ACCESS_SECRET;

    if (!authHeader) {
        response.sendStatus(401);
        return;
    }

    if (!secret) {
        response.status(500).json("No secret provided");
        return;
    }

    try {
        verify(authHeader, secret) as JwtPayload;
        next();
    } catch (error) {
        const typedError: Error = error as Error;
        if (typedError.name === 'JsonWebTokenError') {
            response.status(401).json(typedError.message);
        }
        if(typedError.name === 'TokenExpiredError') {
            response.status(401).json(typedError.message);
        }
        response.status(500).json(typedError);
    }

}