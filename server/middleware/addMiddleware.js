import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const requireAuth = (req,res,next)=>{

    const token = req.cookies.jwt;

    // check json web token exists& is verifed
    if(token){
        jwt.verify(token, "Net Ninja Secrect",(err,decodedToken)=>{
           if(err){
            console.log(err.message);
            res.redirect('./login');
           }else{
            console.log(decodedToken);
            next();
           } 

        })
    }
    else{
        res.redirect('./login');
    }
}

// check user
export const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, "Net Ninja Secrect",async(err,decodedToken)=>{
           if(err){
            console.log(err.message);
            res.locals.user = null;
            next();
           }else{
            console.log(decodedToken);
            let user = await User.findById(decodedToken.id).select("-password");
            res.locals.user = user;

            next();
           } 

        })
    }
    else{
        res.locals.user = null;
        next();
    }
}