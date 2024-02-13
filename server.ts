import express, { Request, Response, NextFunction}from "express";

import { Schema,model, connect } from 'mongoose';
import cors from 'cors';

import commentDb from './Router/commentDb';
import userDb from './Router/userDb';

import ExpressError from './utils/ExpressError'
import passportConfig from './passport/index';
import {isLoggedIn} from './isLoggedIn'
import errorHandler from './utils/errorHandler'
import {User,IuserSchema} from './model/userSchema'
import {CommentModel,reCommentModel} from './model/commentSchema'
import localStrategy from "./passport/localStrategy";
import googleStrategy from "./passport/googleStrategy";

import passport from 'passport'
import session from 'express-session';
import flash from 'express-flash';
import path from 'path';
import multer from 'multer';
import axios from 'axios';


const port = 8001;
const app = express();


app.use('/public', express.static(path.join(__dirname, 'public')));




connect('mongodb://127.0.0.1:27017/commentProjectDb')
.then(()=>console.log('success!!'))
.catch(e=>{console.log(e)})


app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // 클라이언트 애플리케이션의 주소
    credentials: true,
  }));

app.use(session({
    secret: `SFSEFSEF`,
    resave: false,
    saveUninitialized: true,
  }));



app.use(flash());


passportConfig(); // bring passportConfig(); &deserializeUser
localStrategy(passport);
googleStrategy(passport);



app.use(passport.initialize()); // passport 구동
app.use(passport.session());


app.use((req,res,next)=>{
    console.log(req.user,'1');

    if(req.user){
        console.log('user.exist')
        // const test = req.isAuthenticated();
        // res.send({'user':test})
    }else{
        
    }

    next()
})

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
  }));
app.use(flash());

app.use('/api', commentDb);
app.use('/user', userDb);

app.get('/isLogin',isLoggedIn,errorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({ redirect: '/main' });
}))





app.post('/checkDb',errorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const data = req.body;  //input,type
    if(data.type === 'email'){
        const Users = await User.findOne({ email: data.input});
        if(Users){
            res.status(200).json({ result: true }); 
        }else{
            res.status(200).json({ result: false }); 
        }
    }
    else if(data.type === 'username'){
        const Username = await User.findOne({ username: data.input});
        if(Username){
            const info = {username:Username.username,profileImg:Username.profileImg,comments:Username.comments,follower:Username.Follower,following:Username.Following,isAuthenticated:Username.isAuthenticated}
            res.status(200).json({ result: true, info: info}); 
        }else{
            res.status(200).json({ result: false }); 
        }
    }

    else if(data.type === 'author'){
        const Comment = await CommentModel.findOne({ author: data.input});
        if(Comment){
            res.status(200).json({ result: true }); 
        }else{
            res.status(200).json({ result: false }); 
        }

    }
    // else if(data.type === 'userId'){}

    else if(data.type[0] === 'commentId' && data.type[1] === 'replyId'){
        const Comment = await CommentModel.findOne({ _id: data.input});
        if(Comment){
            res.status(200).json({ result: true, info:Comment, type:'comment'}); 
        }else{
            const Reply = await reCommentModel.findOne({ _id: data.input});
            console.log('seriously why?',Reply);
            if(Reply){
                res.status(200).json({ result: true, info:Reply, type:'reply'}); 
            }
           else{
            res.status(200).json({ result: false}); 
           }
        }

    }
    else{
        res.status(401).json({ message: 'please check the type of data' }); 
    }
    // else if(data.type === 'userId'){}
}))

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error((err.message))
    res.status(err.statusCode || 500).send(err);
});


app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new ExpressError('Page not Found!', 404));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
