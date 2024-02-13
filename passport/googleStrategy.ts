import passport from 'passport';
var GoogleStrategy = require('passport-google-oauth20').Strategy;
import {IuserSchema,User} from '../model/userSchema'
import { comparePassword } from '../passwordBcrypt';


const GOOGLE_CLIENT_ID = '655932945527-ujpjbfa3v3sthmtelb0es0p0om0outab.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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'

export default function googleStrategy(passport:any){
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8001/user/login/oauth/redirect"
      },
      async function(accessToken:any, refreshToken:any, profile:any,email:any,cb:any) {
        console.log('bbb',email._json);
        const userInfo = email._json;
        try {
          const user = await User.findOne({ email: userInfo.email });
          if(user === null){
            const data ={profileImg:userInfo.picture,email:userInfo.email,username:userInfo.name}
            const addNewUser = new User(data);
            await addNewUser.save();
            return cb(null, addNewUser);
          }
          return cb(null, user);
        } catch (err) {
            console.log(err);
          return cb(err);
        }
      }
    ));
}



  
//   {
//     id: '100372803130872510064',
//     displayName: '유현우',
//     name: { familyName: '유', givenName: '현우' },
//     emails: [ { value: 'yuh0812@gmail.com', verified: true } ],
//     photos: [
//       {
//         value: 'https://lh3.googleusercontent.com/a/ACg8ocIFhfMmMQSErw9l7uYEE9YWSpQ9mnAh5PtyKNoqIVKEkMM=s96-c'
//       }
//     ],
//     provider: 'google',
//     _raw: '{\n' +
//       '  "sub": "100372803130872510064",\n' +
//       '  "name": "유현우",\n' +
//       '  "given_name": "현우",\n' +
//       '  "family_name": "유",\n' +
//       '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocIFhfMmMQSErw9l7uYEE9YWSpQ9mnAh5PtyKNoqIVKEkMM\\u003ds96-c",\n' +
//       '  "email": "yuh0812@gmail.com",\n' +
//       '  "email_verified": true,\n' +
//       '  "locale": "ko"\n' +
//       '}',
//     _json: {
//       sub: '100372803130872510064',
//       name: '유현우',
//       given_name: '현우',
//       family_name: '유',
//       picture: 'https://lh3.googleusercontent.com/a/ACg8ocIFhfMmMQSErw9l7uYEE9YWSpQ9mnAh5PtyKNoqIVKEkMM=s96-c',
//       email: 'yuh0812@gmail.com',
//       email_verified: true,
//       locale: 'ko'
//     }
//   }