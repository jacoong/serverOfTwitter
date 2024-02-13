import { Schema,model, connect } from 'mongoose';
import { comments, commentType} from './comment'
import {CommentModel} from '../model/commentSchema'


// async function run() {
//     // 4. Connect to MongoDB
//  await connect('mongodb://127.0.0.1:27017/commentProjectDb');
//  await seedDB();
// }

// run().catch(err => console.log(err));

async function run() {
    try {
        // Connect to MongoDB
        await connect('mongodb://127.0.0.1:27017/commentProjectDb');
        console.log('MongoDB connection successful');
        await seedDB();
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }    
}
// const random = (array:[]) => {return Math.floor(Math.random() * array.length+1)}
// const randomPrice = () => {return Math.floor(Math.random() * 101)+5;}
let i: number;
const numberOfComment = comments.length
const seedDB = async() => {
    await CommentModel.deleteMany({})

    for(i=0;i<numberOfComment;i++){

    const comment = new CommentModel<commentType>({
        content:comments[i].content,
        writer:comments[i].writer
    }
    )
    await comment.save();
    }
}

run();