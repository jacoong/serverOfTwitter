import express, { Express, Request, Response, NextFunction } from "express";
import { User, IuserSchema } from "../model/userSchema";
import { hashPassword, comparePassword } from "../passwordBcrypt";
import passport from "passport";
import errorHandler from "../utils/errorHandler";
import { isLoggedIn } from "../isLoggedIn";
import multer from "multer";
import {
  CommentModel,
  Comment,
  reCommentModel,
  reCommentType,
} from "../model/commentSchema";
import { ParamsDictionary } from "express-serve-static-core";
import uploadConfig from "../upLoadConfig";
import axios from "axios";

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 파일 필드 이름에 따라 저장 디렉토리를 결정합니다.
    let dest = "public/";
    if (file.fieldname === "profileImg") {
      dest += "profileImg";
    } else if (file.fieldname === "backgroundImg") {
      dest += "backgroundImg";
    }
    console.log(file.fieldname, "sefesfesfsefesfesfsefesfsefsefsefse레퍼드");
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // 원래 파일의 이름과 확장자를 사용해 파일 이름을 설정합니다.
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  storage: storage,
});

const router = express.Router();
const uploadMiddleware = upload.single("profileImg");
const uploadMultiMiddleware = upload.fields([
  { name: "backgroundImg" },
  { name: "profileImg" },
]);

const GOOGLE_CLIENT_ID =
  "655932945527-ujpjbfa3v3sthmtelb0es0p0om0outab.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_LOGIN_REDIRECT_URI =
  "http://localhost:8001/user/login/oauth/redirect";
const GOOGLE_SIGNUP_REDIRECT_URI =
  "http://localhost:8001/user/signup/oauth/redirect";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

interface msgtype {
  message: string;
}

router.get(
  "/main/:id",
  errorHandler(async (req: Request, res: Response) => {
    const UserId = req.params.id;
    const UsersData = await User.findById(UserId); //need to touch not sending private user info okie?
    const Users = {
      email: UsersData?.email,
      backgroundImg: UsersData?.backgroundImg,
      profileImg: UsersData?.profileImg,
      username: UsersData?.username,
      _id: UsersData?._id,
      isAuthenticated: UsersData?.isAuthenticated,
    };
    res.status(201).json({ userInfo: Users });
  })
);

router.post(
  "/register",
  errorHandler(async (req: Request, res: Response) => {
    const value = req.body;
    const password = await hashPassword(value.password);
    value.password = password;
    const addNewUser = new User<IuserSchema>(value);
    await addNewUser.save();
    res.status(201).json({ message: "register success" });
  })
);

router.post(
  "/register/usernameImg",
  uploadMiddleware,
  errorHandler(async (req: Request, res: Response) => {
    const { username, id } = req.body;
    const imageFile = req.file;

    console.log("username:", username);
    console.log("file info:", imageFile);

    // console.log('nickname:', nickname1);
    // console.log('file info:', imageFile);

    const updateResult = await User.updateOne(
      { _id: id },
      { username: username, profileImg: imageFile?.filename }
    );
    if (updateResult.modifiedCount > 0) {
      res.status(200).send({ result: "complete" });
    } else {
      res.status(401).send({ message: "Update failed" });
    }
  })
);

router.patch(
  "/edit/usernameImg",
  uploadMultiMiddleware,
  errorHandler(async (req: Request, res: Response) => {
    const { id } = req.body;
    console.log("you did it??", id);
    if (!req.files) {
      // req.files가 undefined인 경우에 대한 처리를 해줍니다.
      console.log("error?");
      return;
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const backgroundImg = files["backgroundImg"]
      ? files["backgroundImg"][0]
      : null;
    const profileImg = files["profileImg"] ? files["profileImg"][0] : null;

    console.log("잠자자", backgroundImg, profileImg);

    const updateResult = await User.findOneAndUpdate(
      { _id: id },
      {
        profileImg: profileImg?.filename,
        backgroundImg: backgroundImg?.filename,
      },
      { returnOriginal: false }
    );
    if (updateResult) {
      const ArrayOfComment = updateResult.comments;
      if (ArrayOfComment.length > 0) {
        // ArrayOfComment.map((CommentId)=>
        // await CommentModel.findByIdAndUpdate({ _id: CommentId }, {profileImg:profileImg?.filename})
        // )
      }

      res.status(200).send({ result: "complete", updateResult });
    } else {
      res
        .status(200)
        .send({ result: "nothing changed but complete", updateResult });
    }

    /// 여기에다가 댓글 프로필 사진도 바로 바뀌게끔 알지?

    return;
    // 이후에는 backgroundImg와 image를 사용하여 필요한 작업을 수행하면 됩니다.
  })
);

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile","email"] }
    )
  );
  
  router.get(
    "/login/oauth/redirect",
    passport.authenticate("google", {successRedirect:"http://localhost:3000/", failureRedirect: "/login" }),
    function (req, res) {
        const userdata = req.user;

        return res.status(201).send({message: 'okay!'});
        // return res.redirect({'http://localhost:8001/user/auth/google'});
    }
  );


router.get("/getSession/userinfo", async(req: Request, res: Response) => {
    if(req.user) {
        const { _id } = req.user as IuserSchema;
        const userInfo = await User.findById(_id);
        return res.status(201).send({userInfo: userInfo,req:req.user});
    }else if(!req.user){
      return res.status(200).send('no session data of user');
    }else{
      return res.status(401);
    }
        }
  );
  

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    (err: Error, user: IuserSchema, info: msgtype) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("info", info.message);
        const messages = req.flash("info");
        return res.status(201).send(messages[0]);
        // return res.status(200).json({message:'login successful',userInfo:userInfo});
      }

      req.logIn(user, async (err) => {
        const userId = user._id;

        const userInfo = await User.findById(userId);
        if (err) {
          return next(err);
        }
        return res
          .status(200)
          .json({ message: "login successful", userInfo: userInfo });
      });
    }
  )(req, res, next);
});

router.get("/logOut", (req: any, res: Response, next: NextFunction) => {
  req.logout(function (err: Error) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "logout successful" });
  });
});

router.post(
  "/Follow",
  isLoggedIn,
  errorHandler(async (req: Request, res: Response) => {
    try {
      if (req.user) {
        //checked this id is from post
        const { username } = req.body;

        const { _id } = req.user as IuserSchema;

        const data = await User.findOne({ username: username });
        if (data) {
          const stringArray = data.Follower.map((x) => x.toString());
          let isFollower = stringArray.includes(_id.toString());
          if (isFollower) {
            const updatedFollowed = await User.findOneAndUpdate(
              { username: username },
              { $pull: { Follower: _id } },
              { new: true }
            );
            if (updatedFollowed) {
              await User.findByIdAndUpdate(
                _id,
                { $pull: { Following: updatedFollowed!._id } },
                { new: true }
              );
              const userData = {
                comments: updatedFollowed.comments,
                profileImg: updatedFollowed.profileImg,
                username: updatedFollowed.username,
                Following: updatedFollowed.Following,
                Follower: updatedFollowed.Follower,
                isAuthenticated: updatedFollowed.isAuthenticated,
              };
              const totalData = { userData: userData, isFollower: !isFollower };
              return res.status(200).send({ totalData: totalData });
            }
            return res.status(401).json({ message: "updatedFollowed failed" });
          } else {
            const updatedFollowed = await User.findOneAndUpdate(
              { username: username },
              { $push: { Follower: _id } },
              { new: true }
            );
            if (updatedFollowed) {
              await User.findByIdAndUpdate(
                _id,
                { $push: { Following: updatedFollowed!._id } },
                { new: true }
              );
              const totalData = {
                userData: updatedFollowed,
                isFollower: !isFollower,
              };
              return res.status(200).send({ totalData: totalData });
            }
            return res.status(401).json({ message: "updatedFollowed failed" });
          }
        } else {
          return res.status(401).json({ message: "can not find user" });
        }
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch {
      res
        .status(401)
        .send({
          message: "something wrong while creating Post. try again Please.",
        });
    }
  })
);

router.get(
  "/Follow/:username",
  isLoggedIn,
  errorHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
      if (req.user) {
        const { _id } = req.user as IuserSchema;

        const data = await User.findOne({ username: username });
        if (data) {
          console.log("-----------+++++", data);

          const isOwner = _id.toString() === data._id.toString();
          console.log("qsqsqsq", _id, data._id);

          const stringArray = data.Follower.map((x) => x.toString());
          console.log(stringArray);
          let isFollower = stringArray.includes(_id.toString());
          const userData = {
            comments: data.comments,
            backgroundImg: data.backgroundImg,
            profileImg: data.profileImg,
            username: data.username,
            Following: data.Following,
            Follower: data.Follower,
            isAuthenticated: data.isAuthenticated,
          };
          const totalData = {
            userData: userData,
            isFollower: isFollower,
            isOwner: isOwner,
          };
          res.status(200).send({ totalData: totalData });
        } else {
          return res.status(401).json({ message: "can not find user" });
        }
      } else {
        return res.status(401).json({ message: "unauthenticated" });
      }
    } catch {
      console.log("error during get replies");
    }
  })
);

router.get(
  "/isAdmin",
  errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        const { _id, username } = req.user as IuserSchema;
        console.log(_id.toString(), "65465c5d7b8cc3db370c4950");
        if (_id.toString() === "65465c5d7b8cc3db370c4950") {
          res.status(200).json({ redirect: "/admin" });
        } else {
          res.status(200).json({ redirect: "/" });
        }
      } else {
        res.status(200).json({ redirect: "/" });
      }
    } catch {
      res.status(200).json({ redirect: "/" });
    }
  })
);

router.get(
  "/getUsers",
  errorHandler(async (req: Request, res: Response) => {
    const UserId = req.params.id;
    const UsersData = await User.find(
      {},
      "profileImg username _id isAuthenticated"
    ); //need to touch not sending private user info okie?
    res.status(200).json({ userInfo: UsersData });
  })
);

router.patch(
  "/Authenticated",
  errorHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      console.log("sefsefe", id);
      if (req.user) {
        console.log(req.user, "해줘잉");
        const { _id, username } = req.user as IuserSchema;
        if (_id.toString() === "65465c5d7b8cc3db370c4950") {
          const targetUser = await User.findById(id);
          const targetreComment = await CommentModel.find({ author: id });
          const targetComment = await reCommentModel.find({ author: id });
          if (targetUser) {
            try {
              targetUser.isAuthenticated = !targetUser.isAuthenticated;
              if (targetreComment.length > 0) {
                for (let comment of targetreComment) {
                  comment.isAuthenticated = !comment.isAuthenticated;
                  await comment.save();
                }
              }
              if (targetComment.length > 0) {
                for (let comment of targetComment) {
                  comment.isAuthenticated = !comment.isAuthenticated;
                  await comment.save();
                }
              }
              const saveUser = await targetUser.save();
              return res.status(200).json({ saveUser: saveUser });
            } catch {
              return res
                .status(401)
                .json({ meg: "when modificating authenticate, error occur!" });
            }
          } else {
            res.status(401).json({ meg: "when finding user something wrong" });
          }
          // const AuthenticatedUser = await User.findByIdAndUpdate(id,{$set: { isAuthenticated: !isAuthenticated } },{new:true })
          res.status(200).json({ redirect: "/admin" });
        } else {
          res.status(200).json({ redirect: "/" });
        }
      } else {
        res.status(200).json({ redirect: "/" });
      }
    } catch {
      res.status(200).json({ redirect: "/" });
    }
  })
);
// router.delete('/:id', errorHandler(async(req:Request,res:Response)=>{
//     const {id} = req.params;
//     await CommentModel.findByIdAndDelete(id);
//     res.status(200).send({ message: 'Deleted successfully' });
// }))

// router.get('/loginWithGoogleApi', (req, res) => {
//     let url = 'https://accounts.google.com/o/oauth2/v2/auth';
// 	// client_id는 위 스크린샷을 보면 발급 받았음을 알 수 있음
// 	// 단, 스크린샷에 있는 ID가 아닌 당신이 직접 발급 받은 ID를 사용해야 함.
//     url += `?client_id=${GOOGLE_CLIENT_ID}`
// 	// 아까 등록한 redirect_uri
//     // 로그인 창에서 계정을 선택하면 구글 서버가 이 redirect_uri로 redirect 시켜줌
//     url += `&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}`
//     // 필수 옵션.
//     url += '&response_type=code'
//   	// 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
//     url += '&scope=email profile'
//   	// 완성된 url로 이동
//   	// 이 url이 위에서 본 구글 계정을 선택하는 화면임.
// 	res.redirect(url);
// });

// router.get("/joinWithGoogleApi", (req, res) => {
//   let url = "https://accounts.google.com/o/oauth2/v2/auth";
//   // client_id는 위 스크린샷을 보면 발급 받았음을 알 수 있음
//   // 단, 스크린샷에 있는 ID가 아닌 당신이 직접 발급 받은 ID를 사용해야 함.
//   url += `?client_id=${GOOGLE_CLIENT_ID}`;
//   // 아까 등록한 redirect_uri
//   // 로그인 창에서 계정을 선택하면 구글 서버가 이 redirect_uri로 redirect 시켜줌
//   url += `&redirect_uri=${GOOGLE_SIGNUP_REDIRECT_URI}`;
//   // 필수 옵션.
//   url += "&response_type=code";
//   // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
//   url += "&scope=email profile";
//   // 완성된 url로 이동
//   // 이 url이 위에서 본 구글 계정을 선택하는 화면임.
//   res.redirect(url);
// });

// router.get("/login/oauth/redirect", (req, res) => {
//   const { code } = req.query;
//   console.log(`code: ${code}`);
//   async function fetchGoogleToken() {
//     const resp = await axios.post(`${GOOGLE_TOKEN_URL}`, {
//       code,
//       client_id: GOOGLE_CLIENT_ID,
//       client_secret: GOOGLE_CLIENT_SECRET,
//       redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
//       grant_type: "authorization_code",
//     });

//     const resp2 = await axios.get(GOOGLE_USERINFO_URL, {
//       // Request Header에 Authorization 추가
//       headers: {
//         Authorization: `Bearer ${resp.data.access_token}`,
//       },
//     });
//     res.status(201).json({ message: "register success" });
//   }

//   fetchGoogleToken();
// });

// router.get("/login/oauth/redirect", (req, res) => {
//   const { code } = req.query;
//   console.log(`code: ${code}`);
//   async function fetchGoogleToken() {
//     const resp = await axios.post(`${GOOGLE_TOKEN_URL}`, {
//       code,
//       client_id: GOOGLE_CLIENT_ID,
//       client_secret: GOOGLE_CLIENT_SECRET,
//       redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
//       grant_type: "authorization_code",
//     });

//     const resp2 = await axios.get(GOOGLE_USERINFO_URL, {
//       // Request Header에 Authorization 추가
//       headers: {
//         Authorization: `Bearer ${resp.data.access_token}`,
//       },
//     });

//     let googleUserData = resp2.data;
//     const hashedPassword = await hashPassword(googleUserData.id);
//     googleUserData = {
//       email: googleUserData.email,
//       password: hashedPassword,
//       profileImg: googleUserData.picture,
//       username: googleUserData.name,
//     };
//     const addNewUser = new User<IuserSchema>(googleUserData);
//     await addNewUser.save();
//     res.status(201).json({ addNewUser });
//   }

//   fetchGoogleToken();

//   // res.status(201).json({message:'성공했따!! 헬스 고고!!'});
// });


export default router;
