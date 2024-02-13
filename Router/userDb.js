"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userSchema_1 = require("../model/userSchema");
var passwordBcrypt_1 = require("../passwordBcrypt");
var passport_1 = __importDefault(require("passport"));
var errorHandler_1 = __importDefault(require("../utils/errorHandler"));
var isLoggedIn_1 = require("../isLoggedIn");
var multer_1 = __importDefault(require("multer"));
var commentSchema_1 = require("../model/commentSchema");
var path = require("path");
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        // 파일 필드 이름에 따라 저장 디렉토리를 결정합니다.
        var dest = "public/";
        if (file.fieldname === "profileImg") {
            dest += "profileImg";
        }
        else if (file.fieldname === "backgroundImg") {
            dest += "backgroundImg";
        }
        console.log(file.fieldname, "sefesfesfsefesfesfsefesfsefsefsefse레퍼드");
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        // 원래 파일의 이름과 확장자를 사용해 파일 이름을 설정합니다.
        var ext = path.extname(file.originalname);
        var name = path.basename(file.originalname, ext);
        cb(null, "".concat(name, "-").concat(Date.now()).concat(ext));
    },
});
var upload = (0, multer_1.default)({
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    storage: storage,
});
var router = express_1.default.Router();
var uploadMiddleware = upload.single("profileImg");
var uploadMultiMiddleware = upload.fields([
    { name: "backgroundImg" },
    { name: "profileImg" },
]);
var GOOGLE_CLIENT_ID = "655932945527-ujpjbfa3v3sthmtelb0es0p0om0outab.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "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";
var GOOGLE_LOGIN_REDIRECT_URI = "http://localhost:8001/user/login/oauth/redirect";
var GOOGLE_SIGNUP_REDIRECT_URI = "http://localhost:8001/user/signup/oauth/redirect";
var GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
var GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
router.get("/main/:id", (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var UserId, UsersData, Users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                UserId = req.params.id;
                return [4 /*yield*/, userSchema_1.User.findById(UserId)];
            case 1:
                UsersData = _a.sent();
                Users = {
                    email: UsersData === null || UsersData === void 0 ? void 0 : UsersData.email,
                    backgroundImg: UsersData === null || UsersData === void 0 ? void 0 : UsersData.backgroundImg,
                    profileImg: UsersData === null || UsersData === void 0 ? void 0 : UsersData.profileImg,
                    username: UsersData === null || UsersData === void 0 ? void 0 : UsersData.username,
                    _id: UsersData === null || UsersData === void 0 ? void 0 : UsersData._id,
                    isAuthenticated: UsersData === null || UsersData === void 0 ? void 0 : UsersData.isAuthenticated,
                };
                res.status(201).json({ userInfo: Users });
                return [2 /*return*/];
        }
    });
}); }));
router.post("/register", (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var value, password, addNewUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                value = req.body;
                return [4 /*yield*/, (0, passwordBcrypt_1.hashPassword)(value.password)];
            case 1:
                password = _a.sent();
                value.password = password;
                addNewUser = new userSchema_1.User(value);
                return [4 /*yield*/, addNewUser.save()];
            case 2:
                _a.sent();
                res.status(201).json({ message: "register success" });
                return [2 /*return*/];
        }
    });
}); }));
router.post("/register/usernameImg", uploadMiddleware, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, id, imageFile, updateResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, id = _a.id;
                imageFile = req.file;
                console.log("username:", username);
                console.log("file info:", imageFile);
                return [4 /*yield*/, userSchema_1.User.updateOne({ _id: id }, { username: username, profileImg: imageFile === null || imageFile === void 0 ? void 0 : imageFile.filename })];
            case 1:
                updateResult = _b.sent();
                if (updateResult.modifiedCount > 0) {
                    res.status(200).send({ result: "complete" });
                }
                else {
                    res.status(401).send({ message: "Update failed" });
                }
                return [2 /*return*/];
        }
    });
}); }));
router.patch("/edit/usernameImg", uploadMultiMiddleware, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, files, backgroundImg, profileImg, updateResult, ArrayOfComment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.body.id;
                console.log("you did it??", id);
                if (!req.files) {
                    // req.files가 undefined인 경우에 대한 처리를 해줍니다.
                    console.log("error?");
                    return [2 /*return*/];
                }
                files = req.files;
                backgroundImg = files["backgroundImg"]
                    ? files["backgroundImg"][0]
                    : null;
                profileImg = files["profileImg"] ? files["profileImg"][0] : null;
                console.log("잠자자", backgroundImg, profileImg);
                return [4 /*yield*/, userSchema_1.User.findOneAndUpdate({ _id: id }, {
                        profileImg: profileImg === null || profileImg === void 0 ? void 0 : profileImg.filename,
                        backgroundImg: backgroundImg === null || backgroundImg === void 0 ? void 0 : backgroundImg.filename,
                    }, { returnOriginal: false })];
            case 1:
                updateResult = _a.sent();
                if (updateResult) {
                    ArrayOfComment = updateResult.comments;
                    if (ArrayOfComment.length > 0) {
                        // ArrayOfComment.map((CommentId)=>
                        // await CommentModel.findByIdAndUpdate({ _id: CommentId }, {profileImg:profileImg?.filename})
                        // )
                    }
                    res.status(200).send({ result: "complete", updateResult: updateResult });
                }
                else {
                    res
                        .status(200)
                        .send({ result: "nothing changed but complete", updateResult: updateResult });
                }
                /// 여기에다가 댓글 프로필 사진도 바로 바뀌게끔 알지?
                return [2 /*return*/];
        }
    });
}); }));
router.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/login/oauth/redirect", passport_1.default.authenticate("google", { successRedirect: "http://localhost:3000/", failureRedirect: "/login" }), function (req, res) {
    var userdata = req.user;
    return res.status(201).send({ message: 'okay!' });
    // return res.redirect({'http://localhost:8001/user/auth/google'});
});
router.get("/getSession/userinfo", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, userInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user) return [3 /*break*/, 2];
                _id = req.user._id;
                return [4 /*yield*/, userSchema_1.User.findById(_id)];
            case 1:
                userInfo = _a.sent();
                return [2 /*return*/, res.status(201).send({ userInfo: userInfo, req: req.user })];
            case 2: return [2 /*return*/];
        }
    });
}); });
router.post("/login", function (req, res, next) {
    passport_1.default.authenticate("local", function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("info", info.message);
            var messages = req.flash("info");
            return res.status(201).send(messages[0]);
            // return res.status(200).json({message:'login successful',userInfo:userInfo});
        }
        req.logIn(user, function (err) { return __awaiter(void 0, void 0, void 0, function () {
            var userId, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = user._id;
                        return [4 /*yield*/, userSchema_1.User.findById(userId)];
                    case 1:
                        userInfo = _a.sent();
                        if (err) {
                            return [2 /*return*/, next(err)];
                        }
                        return [2 /*return*/, res
                                .status(200)
                                .json({ message: "login successful", userInfo: userInfo })];
                }
            });
        }); });
    })(req, res, next);
});
router.get("/logOut", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({ message: "logout successful" });
    });
});
router.post("/Follow", isLoggedIn_1.isLoggedIn, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, _id, data, stringArray, isFollower, updatedFollowed, userData, totalData, updatedFollowed, totalData, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 14, , 15]);
                if (!req.user) return [3 /*break*/, 12];
                username = req.body.username;
                _id = req.user._id;
                return [4 /*yield*/, userSchema_1.User.findOne({ username: username })];
            case 1:
                data = _b.sent();
                if (!data) return [3 /*break*/, 10];
                stringArray = data.Follower.map(function (x) { return x.toString(); });
                isFollower = stringArray.includes(_id.toString());
                if (!isFollower) return [3 /*break*/, 5];
                return [4 /*yield*/, userSchema_1.User.findOneAndUpdate({ username: username }, { $pull: { Follower: _id } }, { new: true })];
            case 2:
                updatedFollowed = _b.sent();
                if (!updatedFollowed) return [3 /*break*/, 4];
                return [4 /*yield*/, userSchema_1.User.findByIdAndUpdate(_id, { $pull: { Following: updatedFollowed._id } }, { new: true })];
            case 3:
                _b.sent();
                userData = {
                    comments: updatedFollowed.comments,
                    profileImg: updatedFollowed.profileImg,
                    username: updatedFollowed.username,
                    Following: updatedFollowed.Following,
                    Follower: updatedFollowed.Follower,
                    isAuthenticated: updatedFollowed.isAuthenticated,
                };
                totalData = { userData: userData, isFollower: !isFollower };
                return [2 /*return*/, res.status(200).send({ totalData: totalData })];
            case 4: return [2 /*return*/, res.status(401).json({ message: "updatedFollowed failed" })];
            case 5: return [4 /*yield*/, userSchema_1.User.findOneAndUpdate({ username: username }, { $push: { Follower: _id } }, { new: true })];
            case 6:
                updatedFollowed = _b.sent();
                if (!updatedFollowed) return [3 /*break*/, 8];
                return [4 /*yield*/, userSchema_1.User.findByIdAndUpdate(_id, { $push: { Following: updatedFollowed._id } }, { new: true })];
            case 7:
                _b.sent();
                totalData = {
                    userData: updatedFollowed,
                    isFollower: !isFollower,
                };
                return [2 /*return*/, res.status(200).send({ totalData: totalData })];
            case 8: return [2 /*return*/, res.status(401).json({ message: "updatedFollowed failed" })];
            case 9: return [3 /*break*/, 11];
            case 10: return [2 /*return*/, res.status(401).json({ message: "can not find user" })];
            case 11: return [3 /*break*/, 13];
            case 12: return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
            case 13: return [3 /*break*/, 15];
            case 14:
                _a = _b.sent();
                res
                    .status(401)
                    .send({
                    message: "something wrong while creating Post. try again Please.",
                });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); }));
router.get("/Follow/:username", isLoggedIn_1.isLoggedIn, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, _id, data, isOwner, stringArray, isFollower, userData, totalData, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                username = req.params.username;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                if (!req.user) return [3 /*break*/, 3];
                _id = req.user._id;
                return [4 /*yield*/, userSchema_1.User.findOne({ username: username })];
            case 2:
                data = _b.sent();
                if (data) {
                    console.log("-----------+++++", data);
                    isOwner = _id.toString() === data._id.toString();
                    console.log("qsqsqsq", _id, data._id);
                    stringArray = data.Follower.map(function (x) { return x.toString(); });
                    console.log(stringArray);
                    isFollower = stringArray.includes(_id.toString());
                    userData = {
                        comments: data.comments,
                        backgroundImg: data.backgroundImg,
                        profileImg: data.profileImg,
                        username: data.username,
                        Following: data.Following,
                        Follower: data.Follower,
                        isAuthenticated: data.isAuthenticated,
                    };
                    totalData = {
                        userData: userData,
                        isFollower: isFollower,
                        isOwner: isOwner,
                    };
                    res.status(200).send({ totalData: totalData });
                }
                else {
                    return [2 /*return*/, res.status(401).json({ message: "can not find user" })];
                }
                return [3 /*break*/, 4];
            case 3: return [2 /*return*/, res.status(401).json({ message: "unauthenticated" })];
            case 4: return [3 /*break*/, 6];
            case 5:
                _a = _b.sent();
                console.log("error during get replies");
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); }));
router.get("/isAdmin", (0, errorHandler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _id, username;
    return __generator(this, function (_b) {
        try {
            if (req.user) {
                _a = req.user, _id = _a._id, username = _a.username;
                console.log(_id.toString(), "65465c5d7b8cc3db370c4950");
                if (_id.toString() === "65465c5d7b8cc3db370c4950") {
                    res.status(200).json({ redirect: "/admin" });
                }
                else {
                    res.status(200).json({ redirect: "/" });
                }
            }
            else {
                res.status(200).json({ redirect: "/" });
            }
        }
        catch (_c) {
            res.status(200).json({ redirect: "/" });
        }
        return [2 /*return*/];
    });
}); }));
router.get("/getUsers", (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var UserId, UsersData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                UserId = req.params.id;
                return [4 /*yield*/, userSchema_1.User.find({}, "profileImg username _id isAuthenticated")];
            case 1:
                UsersData = _a.sent();
                res.status(200).json({ userInfo: UsersData });
                return [2 /*return*/];
        }
    });
}); }));
router.patch("/Authenticated", (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, _id, username, targetUser, targetreComment, targetComment, _i, targetreComment_1, comment, _b, targetComment_1, comment, saveUser, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 22, , 23]);
                id = req.body.id;
                console.log("sefsefe", id);
                if (!req.user) return [3 /*break*/, 20];
                console.log(req.user, "해줘잉");
                _a = req.user, _id = _a._id, username = _a.username;
                if (!(_id.toString() === "65465c5d7b8cc3db370c4950")) return [3 /*break*/, 18];
                return [4 /*yield*/, userSchema_1.User.findById(id)];
            case 1:
                targetUser = _e.sent();
                return [4 /*yield*/, commentSchema_1.CommentModel.find({ author: id })];
            case 2:
                targetreComment = _e.sent();
                return [4 /*yield*/, commentSchema_1.reCommentModel.find({ author: id })];
            case 3:
                targetComment = _e.sent();
                if (!targetUser) return [3 /*break*/, 16];
                _e.label = 4;
            case 4:
                _e.trys.push([4, 14, , 15]);
                targetUser.isAuthenticated = !targetUser.isAuthenticated;
                if (!(targetreComment.length > 0)) return [3 /*break*/, 8];
                _i = 0, targetreComment_1 = targetreComment;
                _e.label = 5;
            case 5:
                if (!(_i < targetreComment_1.length)) return [3 /*break*/, 8];
                comment = targetreComment_1[_i];
                comment.isAuthenticated = !comment.isAuthenticated;
                return [4 /*yield*/, comment.save()];
            case 6:
                _e.sent();
                _e.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                if (!(targetComment.length > 0)) return [3 /*break*/, 12];
                _b = 0, targetComment_1 = targetComment;
                _e.label = 9;
            case 9:
                if (!(_b < targetComment_1.length)) return [3 /*break*/, 12];
                comment = targetComment_1[_b];
                comment.isAuthenticated = !comment.isAuthenticated;
                return [4 /*yield*/, comment.save()];
            case 10:
                _e.sent();
                _e.label = 11;
            case 11:
                _b++;
                return [3 /*break*/, 9];
            case 12: return [4 /*yield*/, targetUser.save()];
            case 13:
                saveUser = _e.sent();
                return [2 /*return*/, res.status(200).json({ saveUser: saveUser })];
            case 14:
                _c = _e.sent();
                return [2 /*return*/, res
                        .status(401)
                        .json({ meg: "when modificating authenticate, error occur!" })];
            case 15: return [3 /*break*/, 17];
            case 16:
                res.status(401).json({ meg: "when finding user something wrong" });
                _e.label = 17;
            case 17:
                // const AuthenticatedUser = await User.findByIdAndUpdate(id,{$set: { isAuthenticated: !isAuthenticated } },{new:true })
                res.status(200).json({ redirect: "/admin" });
                return [3 /*break*/, 19];
            case 18:
                res.status(200).json({ redirect: "/" });
                _e.label = 19;
            case 19: return [3 /*break*/, 21];
            case 20:
                res.status(200).json({ redirect: "/" });
                _e.label = 21;
            case 21: return [3 /*break*/, 23];
            case 22:
                _d = _e.sent();
                res.status(200).json({ redirect: "/" });
                return [3 /*break*/, 23];
            case 23: return [2 /*return*/];
        }
    });
}); }));
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
exports.default = router;
