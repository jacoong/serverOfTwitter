import mongoose,{ Schema,model } from 'mongoose';


interface IuserSchema extends mongoose.Document {
    email: string;
    profileImg: string;
    backgroundImg:string|null;
    password: string;
    username: string|null;
    comments:[{type : mongoose.Schema.Types.ObjectId , ref:'Comment'}];
    Follower:[{type : mongoose.Schema.Types.ObjectId , ref:'User'}];
    Following:[{type : mongoose.Schema.Types.ObjectId , ref:'User'}];
    isAuthenticated: boolean;
}

const userSchema = new Schema<IuserSchema>({
    email:{ type:String, required:true},
    password:{ type:String, required:false},
    username:{ type:String, required:false },
    profileImg:{ type:String, required:false },
    backgroundImg:{ type:String, required:false },
    comments:[{type: mongoose.Schema.Types.ObjectId, ref:'CommentModel'}],
    Follower:[{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    Following:[{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    isAuthenticated:{ type:Boolean, required:true, default : false},
});


const User = model<IuserSchema>('User', userSchema);

export { User,IuserSchema }
