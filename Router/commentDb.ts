import express, {Express, Request, Response}from "express";
import {CommentModel,Comment,reCommentModel,reCommentType} from '../model/commentSchema'
import { commentType } from "../seed/comment";
import errorHandler from '../utils/errorHandler'
import {User,IuserSchema} from '../model/userSchema'
import { isLoggedIn } from "../isLoggedIn";
import { isContext } from "vm";

const router = express.Router();


interface typeOfContent  {
    content: string;
    writer: string;
}

// router.get('/main',errorHandler(async(req:Request,res:Response,)=>{
//     const Comments = await CommentModel.find({}).sort({updatedAt: -1}).limit(10);
//     if(Comments){
//       res.send(Comments);
//     }
//     // res.send(Comments);
// }))


router.get('/main/:skip',errorHandler(async(req:Request,res:Response,)=>{

  const {skip} = req.params;
  if(skip){
    const Comments = await CommentModel.find({}).sort({updatedAt: -1}).skip(Number(skip)).limit(20);
    if(Comments){
      res.send(Comments);
    }
  }else{
    const Comments = await CommentModel.find({}).sort({updatedAt: -1}).limit(20);
    if(Comments){
      res.send(Comments);
    }
  }

  // res.send(Comments);
}))


router.post('/main', isLoggedIn, errorHandler(async (req: Request, res: Response) => {
    const {todoText} = await req.body;
    try {
          if(req.user){
            const {_id,username} = req.user as IuserSchema;
            const GetUserFromId = await User.findById(_id);

            const data = {content:todoText,author:_id,isAuthenticated:GetUserFromId!.isAuthenticated}
            const addNewComment = new CommentModel(data);
            const commentObjecct = await addNewComment.save();
            const commentObjectId = commentObjecct._id
        
            await User.findByIdAndUpdate(_id, { $push: { comments: commentObjectId } },{new:true });
      
            res.status(200).send({ message:'successfully made post!' });
          }else{
          return res.status(401).json({ message: 'Unauthorized' });
          }
      }
      catch (error) {
        res.status(401).send({ message: 'something wrong while creating Post. try again Please.',error});
      }
      }
    
  ));

router.delete('/main/:commentid',errorHandler(async(req:Request,res:Response)=>{
  console.log('saefaeijsofjsoifajesofijasfoiasjoiesajfoisaejfoiesfjoseijfoaesifjoseaifjosaefjeosao')
  if (req.user) {
    const {commentid} = req.params
    const {_id} = req.user as IuserSchema;
    const targetComment = await CommentModel.findById(commentid); // if id is part of post ?
    const targetreComment = await reCommentModel.findById(commentid);

      if(targetComment){  //checked this id is from post
    
          if (targetComment.author === _id.toString()) {
            await CommentModel.findByIdAndDelete(commentid);
            await User.findByIdAndUpdate(_id, { $pull: { comments: commentid } },{new:true })
            .then(updatedUser => {
              req.flash('good', 'Deleted Post successfully');
              const messages = req.flash('good')
              res.status(200).send({ message: messages[0], type:'comment' });
            })
            .catch(err => {
              req.flash('bad', 'Something wrong deleting Post!');
              const messages = req.flash('bad')
              res.status(401).send({ message: messages[0]});
            });
          }else{
          return res.status(403).json({ error: 'You do not have permission to delete this comment.' });}    
      
      }

      if(targetreComment){
        const parentIdOfReply = targetreComment.parentId;
        if (targetreComment.author === _id.toString()) {
          await reCommentModel.findByIdAndDelete(commentid);
          await reCommentModel.findByIdAndUpdate(parentIdOfReply, { $pull: { replies: commentid } },{new:true })
          await CommentModel.findByIdAndUpdate(parentIdOfReply, { $pull: { comments: commentid } },{new:true })
          await User.findByIdAndUpdate(parentIdOfReply, { $pull: { comments: commentid } },{new:true })
          .then(updatedUser => {
            console.log('3',updatedUser)
            req.flash('good', 'Deleted Comment Successfully');
            const messages = req.flash('good')
            res.status(200).send({ message:  messages[0], type:'reply' });
          })
          .catch(err => {
            req.flash('bad', 'Something wrong deleting comment!');
            const messages = req.flash('bad')
            res.status(401).send({ message: messages[0]});
          });
        }else{
        return res.status(403).json({ error: 'You do not have permission to delete this recomment.' });}    
      }
    
  }else{
    return res.status(401).json({ message: 'Unauthorized' });
  }
}))



router.get('/main/reply/:Id/:skip',isLoggedIn, errorHandler(async (req: Request, res: Response) => {

  const { Id,skip } = req.params;
  console.log('parentId',Id);
  try{
      let data
      if(skip){
        data = await CommentModel.findById(Id).populate({
          path: 'comments',
          options: { 
              sort: { 'updatedAt': -1 },  // sort by updatedAt in descending order
              skip: Number(skip), // skip a number of documents
              limit:10
          }
        })
        if(data){
          res.status(200).send({ data:data, type:'comment' });
        }else{
          data = await reCommentModel.findById(Id).populate({
            path: 'replies',
            options: { 
                sort: { 'updatedAt': -1 },  // sort by updatedAt in descending order
                skip: Number(skip), // skip a number of documents
                limit:10
            }
          })
          if(data){
            res.status(200).send({ data:data, type:'reply' });
          }
          else{
            res.status(200).send({ meesage:'Your post was sent.'});
          }
        }
      }else{
        data = await CommentModel.findById(Id).sort({updatedAt: -1}).limit(20);
        if(data){
          res.status(200).send({ data:data, type:'comment' });
      }else{
        data = await reCommentModel.findById(Id).sort({updatedAt: -1}).limit(20);
        if(data){
          res.status(200).send({ data:data, type:'reply' });
      }else{
        res.status(200).send({ meesage:'Your post was sent.'});
      }
    }}
  }
    catch{
      console.log('error during get replies')
    }
  }));


router.get('/main/getCommentInfo/:Id',isLoggedIn, errorHandler(async (req: Request, res: Response) => {

  const { Id } = req.params;
  console.log('parentId',Id);
  try{
    if(req.user){
      const {_id,username} = req.user as IuserSchema;
      let data = await CommentModel.findById(Id) //check,  data is post or comment
      if(data){

        const userData = await User.findById(data.author);

        console.log('sfsefesf',userData,data,'only possible');
        const arrayOfLiked = data.like;
        const stringsArray = arrayOfLiked.map(x => x.toString());
        const isLiked = stringsArray.includes(_id.toString());
        console.log('check this',stringsArray,_id,isLiked)
        const totalData = {data:data,type:'comment',isLiked:isLiked,userData:userData}
        res.status(200).send({ totalData:totalData });
      }else{
        const data = await reCommentModel.findById(Id)
        if (data){
          const userData = await User.findById(data.author);

          const arrayOfLiked = data.like;
          const stringsArray = arrayOfLiked.map(x => x.toString()); 
          const isLiked = stringsArray.includes(_id.toString());
          const totalData = {data:data,type:'reply',isLiked:isLiked,userData:userData}
          res.status(200).send({ totalData:totalData });
        }
      }
    }else{
      console.log('login please')
    }
    }
    catch{
      console.log('error during get replies')
    }
  }));



  

router.patch('/main/edit/:Id', isLoggedIn, errorHandler(async (req: Request, res: Response) => {

  const {Id} = req.params;
  const {updateText} = req.body;
  try {
        if(req.user){
          const {_id,username} = req.user as IuserSchema;
          const LoginedUserId = _id.toString();
          const isComment = await CommentModel.findById(Id) // if true it's a comment

          if(isComment){ // if it true, it's a comments not reply
              const postAuthor = isComment.author;
              console.log('불법행위',LoginedUserId);
              if(LoginedUserId ===postAuthor){
                await CommentModel.findByIdAndUpdate(Id, { $set: { content: updateText } },{new:true });
                req.flash('good', 'Post Edit successful!');
                const messages = req.flash('good')
                res.status(200).send({ message: messages[0], type:'comments',test:updateText});
              }else{
                throw Error;
              }
          }else{
              const GetcommentAwait = await reCommentModel.findById(Id);
              if(LoginedUserId === GetcommentAwait!.author){
                await reCommentModel.findByIdAndUpdate(Id, { $set: { content: updateText } },{new:true });
                req.flash('good', 'Comment Edit successful!');
                const messages = req.flash('good')
                res.status(200).send({ message: messages[0], type:'reply', parentId:GetcommentAwait!.parentId,test:updateText});
              }else{
                throw Error;
              }
          }
        }
    }catch (error) {
      const messages = req.flash('bad')
      req.flash('bad', 'something wrong Editing comment');
      res.status(401).send({ message: messages[0] });
    }
  } 
  ));




router.post('/main/reply', isLoggedIn, errorHandler(async (req: Request, res: Response) => {

    const {todoText,parentId} = await req.body;
    try {
          if(req.user){
            const {_id,username} = req.user as IuserSchema;
            const GetUserFromId = await User.findById(_id);
            const data = {content:todoText,writer:username,author:_id,profileImg:GetUserFromId!.profileImg,parentId:parentId}
  
          
            const AddreCommentModel = new reCommentModel(data);
            const reCoomentObjecct = await AddreCommentModel.save();
  
            const reCoomentObjecctId = reCoomentObjecct._id
            console.log('5',AddreCommentModel,);
  
            const isComment = await CommentModel.findById(parentId) // if true it's a comment
  
            if(isComment){ // if it true, it's a comments not reply
              await CommentModel.findByIdAndUpdate(parentId, { $push: { comments: reCoomentObjecctId } },{new:true });
            }else{
              await reCommentModel.findByIdAndUpdate(parentId, { $push: { replies: reCoomentObjecctId } },{new:true });
            }
            req.flash('good', 'Comment Post successful!');
            const messages = req.flash('good')
          res.status(200).send({ message: messages[0] });
          }
      }catch (error) {
        const messages = req.flash('bad')
        req.flash('bad', 'something wrong posting comment');
        res.status(401).send({ message: messages[0] });
      }
    } 
    ));

router.post('/main/like/:type/:commentId',isLoggedIn, errorHandler(async (req: Request, res: Response) => {
      // const {commentId} = req.body;
      const { type,commentId } = req.params; // if id is part of post ?
      console.log(req.user,'whywhy')
      try{
        if(req.user){  //checked this id is from post
          const {_id,username} = req.user as IuserSchema;
      
            if(type === 'comment'){
              const data = await CommentModel.findById(commentId);
              if(data){ 
                
                const userData = await User.findById(data.author);

                const arrayOfLiked = data.like;
                const stringsArray = arrayOfLiked.map(x => x.toString());
                let isLiked = stringsArray.includes(_id.toString())
                if(isLiked){
                  const updatedComment = await CommentModel.findByIdAndUpdate(commentId, { $pull: { like: _id } },{new:true });
                  const totalData = {data:updatedComment,type:'comment',isLiked:!isLiked,userData:userData}
                  res.status(200).send({ totalData:totalData });
                }else{
                  const updatedComment = await CommentModel.findByIdAndUpdate(commentId, { $push: { like: _id } },{new:true });
                  const totalData = {data:updatedComment,type:'comment',isLiked:!isLiked,userData:userData}
                  res.status(200).send({ totalData:totalData });
                }
              }
            }else{
              const data = await reCommentModel.findById(commentId);
              if(data){  
                
                const userData = await User.findById(data.author);

                const arrayOfLiked = data.like;
                const stringsArray = arrayOfLiked.map(x => x.toString());
                let isLiked = stringsArray.includes(_id.toString())
                if(isLiked){
                  const updatedComment =await reCommentModel.findByIdAndUpdate(commentId, { $pull: { like: _id } },{new:true });
                  const totalData = {data:updatedComment,type:'reply',isLiked:!isLiked,userData:userData}
                  res.status(200).send({ totalData:totalData });
                }else{
                  const updatedComment = await reCommentModel.findByIdAndUpdate(commentId, { $push: { like: _id } },{new:true });
                  const totalData = {data:updatedComment,type:'reply',isLiked:!isLiked,userData:userData}
                  res.status(200).send({ totalData:totalData });
                }
              }
            }
          }else{
            return res.status(401).json({ message: 'Unauthorized' });
          }
        }
        catch{
          res.status(401).send({ message: 'something wrong while creating Post. try again Please.'});
        }
      }));

let recommentArray:any[] =[];

async function findParent(parentId?:string) {

  if(parentId){
    const recomment = await reCommentModel.findById(parentId);
    if (recomment && recomment.parentId !== null) {

        recommentArray.unshift(recomment);
        return findParent(recomment.parentId);

    } else if(recomment === null){
      const postComment = await CommentModel.findById(parentId);
      console.log('감문어7',postComment)
      if(postComment){
        recommentArray.unshift(postComment);
        return
      }else{
        console.log('something wrong')
      }
    }
  }
}


router.get('/sendOPtions/:username/:stateOfMenu/:skip',errorHandler(async(req:Request,res:Response)=>{
  const {username,stateOfMenu,skip} = req.params

  if(stateOfMenu === 'Replies'){
    const getUserInfo = await User.find({username:username})
    const getUserId = getUserInfo[0]._id;
    const totalCount = (await reCommentModel.find({author:getUserId})).length
      const Replies = await reCommentModel.find({ author: getUserId}).sort({updatedAt: -1}).skip(Number(skip)).limit(5);
      if(Replies){
          res.status(200).json({ info: Replies, type:'Replies', numberOfArray:totalCount }); 
      }else{
          res.status(200).json({ info: null }); 
      }
  }
  
  else if(stateOfMenu === 'Post'){
    const getUserInfo = await User.find({username:username})
    const getUserId = getUserInfo[0]._id;
    const totalCount = (await CommentModel.find({author:getUserId})).length
      const Post = await CommentModel.find({ author: getUserId}).sort({updatedAt: -1}).skip(Number(skip)).limit(5);
      if(Post){
          res.status(200).json({ info: Post, type:'Post', numberOfArray:totalCount }); 
      }else{
          res.status(200).json({ info: null }); 
      }
  }
  // else if(data.type === 'userId'){}
}))

router.get('/getParentInfo/:parentId',errorHandler(async(req:Request,res:Response,)=>{
  const {parentId} = req.params;
  recommentArray= []
  await findParent(parentId);

  console.log('aaaaaaa', recommentArray);

  
  res.status(200).send({ recommentArray });
}))


router.get('/main/getReply/:commentId',isLoggedIn, errorHandler(async (req: Request, res: Response) => {

  const { commentId } = req.params;
  const targetComment = await CommentModel.findById(commentId); // if id is part of post ?

    if(targetComment){  //checked this id is from post
  try{
      const data = await CommentModel.findById(commentId).populate('comments'); //check,  data is post or comment
      if(data){
        res.status(200).send({ info:data });
      }else{
        const data = await reCommentModel.findById(commentId).populate('replies');
        if (data){
          res.status(200).send({ info:data });
        }else{
          res.status(200).send({ info:data });
        }
      }
    }
    catch{
      console.log('error during get replies')
    }
  }}));



export default  router;