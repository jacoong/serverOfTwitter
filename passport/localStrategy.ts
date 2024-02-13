const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

import { Request } from 'express';
import {IuserSchema,User} from '../model/userSchema'
import { comparePassword } from '../passwordBcrypt';



export default function localStrategy(passport:any) {
  passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'email',
    passwordField: 'password',
    session: true, // 세션에 저장 여부
    passReqToCallback: true,
  }, 
  async (req: Request, email: string, password: string, done:any) => {
    try {
      const exUser = await User.findOne({ email });
      if (!exUser) {
        return done(null, false, { message: 'Not existing ID' });
      }

      const match = await comparePassword(password, exUser.password);
      if (match) {
        return done(null, exUser); // 검증 성공
      } else {
        return done(null, false, { message: 'Your password is wrong' }); // 임의 에러 처리
      }
    } catch (error) {
      console.error(error);
      return done(error);
    } })
); 
}