import type { NextFunction  , Request , Response} from "express";
import  Jwt, { type JwtPayload } from "jsonwebtoken";
export const authmiddleware = (req:Request , res:Response , next:NextFunction)=>{
    const header = req.headers.authorization;
    const token = header?.split(" ")?.[1];
    if(!token){
        return res.send("invalid token ")
    }

    try{
        const {userId} = Jwt.verify(token , process.env.JWT_SECRET!) as JwtPayload  // just ot overcome the stirng;

        req.userId = userId
        next();
    }catch(e){
        res.send("server issue")
    }
    
}