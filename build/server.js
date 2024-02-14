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
var mongoose_1 = require("mongoose");
var cors_1 = __importDefault(require("cors"));
var commentDb_1 = __importDefault(require("./Router/commentDb"));
var userDb_1 = __importDefault(require("./Router/userDb"));
var ExpressError_1 = __importDefault(require("./utils/ExpressError"));
var index_1 = __importDefault(require("./passport/index"));
var isLoggedIn_1 = require("./isLoggedIn");
var errorHandler_1 = __importDefault(require("./utils/errorHandler"));
var userSchema_1 = require("./model/userSchema");
var commentSchema_1 = require("./model/commentSchema");
var localStrategy_1 = __importDefault(require("./passport/localStrategy"));
var googleStrategy_1 = __importDefault(require("./passport/googleStrategy"));
var passport_1 = __importDefault(require("passport"));
var express_session_1 = __importDefault(require("express-session"));
var express_flash_1 = __importDefault(require("express-flash"));
var path_1 = __importDefault(require("path"));
var port = process.env.PORT || 8001;
var app = (0, express_1.default)();
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
(0, mongoose_1.connect)('mongodb+srv://yuh0812:IKyHSWm3MkDKZfFS@clustertoulousehyunwu.tebgoex.mongodb.net/ClusterToulouseHyunwu?retryWrites=true&w=majority')
    .then(function () { return console.log('success!!'); })
    .catch(function (e) { console.log(e); });
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // 클라이언트 애플리케이션의 주소
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: "SFSEFSEF",
    resave: false,
    saveUninitialized: true,
}));
app.use((0, express_flash_1.default)());
(0, index_1.default)(); // bring passportConfig(); &deserializeUser
(0, localStrategy_1.default)(passport_1.default);
(0, googleStrategy_1.default)(passport_1.default);
app.use(passport_1.default.initialize()); // passport 구동
app.use(passport_1.default.session());
app.use(function (req, res, next) {
    console.log(req.user, '1');
    if (req.user) {
        console.log('user.exist');
        // const test = req.isAuthenticated();
        // res.send({'user':test})
    }
    else {
    }
    next();
});
app.use((0, express_session_1.default)({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));
app.use((0, express_flash_1.default)());
app.use('/api', commentDb_1.default);
app.use('/user', userDb_1.default);
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.get('/isLogin', isLoggedIn_1.isLoggedIn, (0, errorHandler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.status(200).json({ redirect: '/main' });
        return [2 /*return*/];
    });
}); }));
app.post('/checkDb', (0, errorHandler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, Users, Username, info, Comment_1, Comment_2, Reply;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = req.body;
                if (!(data.type === 'email')) return [3 /*break*/, 2];
                return [4 /*yield*/, userSchema_1.User.findOne({ email: data.input })];
            case 1:
                Users = _a.sent();
                if (Users) {
                    res.status(200).json({ result: true });
                }
                else {
                    res.status(200).json({ result: false });
                }
                return [3 /*break*/, 12];
            case 2:
                if (!(data.type === 'username')) return [3 /*break*/, 4];
                return [4 /*yield*/, userSchema_1.User.findOne({ username: data.input })];
            case 3:
                Username = _a.sent();
                if (Username) {
                    info = { username: Username.username, profileImg: Username.profileImg, comments: Username.comments, follower: Username.Follower, following: Username.Following, isAuthenticated: Username.isAuthenticated };
                    res.status(200).json({ result: true, info: info });
                }
                else {
                    res.status(200).json({ result: false });
                }
                return [3 /*break*/, 12];
            case 4:
                if (!(data.type === 'author')) return [3 /*break*/, 6];
                return [4 /*yield*/, commentSchema_1.CommentModel.findOne({ author: data.input })];
            case 5:
                Comment_1 = _a.sent();
                if (Comment_1) {
                    res.status(200).json({ result: true });
                }
                else {
                    res.status(200).json({ result: false });
                }
                return [3 /*break*/, 12];
            case 6:
                if (!(data.type[0] === 'commentId' && data.type[1] === 'replyId')) return [3 /*break*/, 11];
                return [4 /*yield*/, commentSchema_1.CommentModel.findOne({ _id: data.input })];
            case 7:
                Comment_2 = _a.sent();
                if (!Comment_2) return [3 /*break*/, 8];
                res.status(200).json({ result: true, info: Comment_2, type: 'comment' });
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, commentSchema_1.reCommentModel.findOne({ _id: data.input })];
            case 9:
                Reply = _a.sent();
                console.log('seriously why?', Reply);
                if (Reply) {
                    res.status(200).json({ result: true, info: Reply, type: 'reply' });
                }
                else {
                    res.status(200).json({ result: false });
                }
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                res.status(401).json({ message: 'please check the type of data' });
                _a.label = 12;
            case 12: return [2 /*return*/];
        }
    });
}); }));
app.use(function (err, req, res, next) {
    console.error((err.message));
    res.status(err.statusCode || 500).send(err);
});
app.all('*', function (req, res, next) {
    next(new ExpressError_1.default('Page not Found!', 404));
});
app.listen(port, function () {
    console.log("Listening on port ".concat(port));
});
