import mongoose,{ Schema,model } from 'mongoose';

interface Comment {
    content: string;
    author:string;
    profileImg:string;
    comments:[mongoose.Schema.Types.ObjectId];
    like:[mongoose.Schema.Types.ObjectId];
    isAuthenticated: boolean;
}


interface reCommentType {
    content: string;
    writer: string;
    author:string;
    profileImg:string;
    parentId:string,required:true,
    replies:[mongoose.Schema.Types.ObjectId];
    like:[mongoose.Schema.Types.ObjectId];
    isAuthenticated: boolean;
}


const commentSchema = new Schema<Comment>({
    content:{ type:String, required:true},
    author: { type: String,required:true},
    profileImg: { type: String,required:false},
    comments: [{ type:  mongoose.Schema.Types.ObjectId, ref:'reComment' }],
    like:[{type:mongoose.Schema.Types.ObjectId,required:false}],
    isAuthenticated:{ type:Boolean, required:true, default : false},
},{ timestamps: true });



const reCommentSchema = new Schema({
    content: { type: String },
    author: { type: String },
    profileImg: { type: String,required:false},
    parentId:{type: String,required:true},
    replies: [{ type: Schema.Types.ObjectId, ref: 'reComment' }],
    like:[{type:Schema.Types.ObjectId,required:false}],
    isAuthenticated:{ type:Boolean, required:true, default : false},
  },{ timestamps: true });


const CommentModel = model<Comment>('Comment', commentSchema);
const reCommentModel = model<reCommentType>('reComment', reCommentSchema);

export {CommentModel,Comment,reCommentModel,reCommentType};
