const passport = require('passport');
import {IuserSchema,User} from '../model/userSchema'

export default () => {
    passport.serializeUser((user:IuserSchema, done:any) => { // Strategy 성공 시 호출됨
      done(null, user._id); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
    });
  
    passport.deserializeUser(async(id:string, done:any) => { // 매개변수 id는 serializeUser의 done의 인자 user._id를 받은 것
      try {
        const user = await User.findById(id);
        done(null, user); // 여기의 user가 req.user가 됨
      } catch (err) {
        done(err);
      }
    });
  };


//   export default function passportConfig(passport) {
//     passport.serializeUser((user, done) => {
//       done(null, user._id);
//     });
  
//     passport.deserializeUser(async (id, done) => {
//       try {
//         const user = await User.findById(id);
//         done(null, user);
//       } catch (err) {
//         done(err);
//       }
//     });
//   }