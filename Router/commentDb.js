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
var commentSchema_1 = require("../model/commentSchema");
var errorHandler_1 = __importDefault(require("../utils/errorHandler"));
var userSchema_1 = require("../model/userSchema");
var isLoggedIn_1 = require("../isLoggedIn");
var router = express_1.default.Router();
// router.get('/main',errorHandler(async(req:Request,res:Response,)=>{
//     const Comments = await CommentModel.find({}).sort({updatedAt: -1}).limit(10);
//     if(Comments){
//       res.send(Comments);
//     }
//     // res.send(Comments);
// }))
router.get('/main/:skip', (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var skip, Comments, Comments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                skip = req.params.skip;
                if (!skip) return [3 /*break*/, 2];
                return [4 /*yield*/, commentSchema_1.CommentModel.find({}).sort({ updatedAt: -1 }).skip(Number(skip)).limit(20)];
            case 1:
                Comments = _a.sent();
                if (Comments) {
                    res.send(Comments);
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, commentSchema_1.CommentModel.find({}).sort({ updatedAt: -1 }).limit(20)];
            case 3:
                Comments = _a.sent();
                if (Comments) {
                    res.send(Comments);
                }
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); }));
router.post('/main', isLoggedIn_1.isLoggedIn, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var todoText, _a, _id, username, GetUserFromId, data, addNewComment, commentObjecct, commentObjectId, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, req.body];
            case 1:
                todoText = (_b.sent()).todoText;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 8, , 9]);
                if (!req.user) return [3 /*break*/, 6];
                _a = req.user, _id = _a._id, username = _a.username;
                return [4 /*yield*/, userSchema_1.User.findById(_id)];
            case 3:
                GetUserFromId = _b.sent();
                data = { content: todoText, author: _id, isAuthenticated: GetUserFromId.isAuthenticated };
                addNewComment = new commentSchema_1.CommentModel(data);
                return [4 /*yield*/, addNewComment.save()];
            case 4:
                commentObjecct = _b.sent();
                commentObjectId = commentObjecct._id;
                return [4 /*yield*/, userSchema_1.User.findByIdAndUpdate(_id, { $push: { comments: commentObjectId } }, { new: true })];
            case 5:
                _b.sent();
                res.status(200).send({ message: 'successfully made post!' });
                return [3 /*break*/, 7];
            case 6: return [2 /*return*/, res.status(401).json({ message: 'Unauthorized' })];
            case 7: return [3 /*break*/, 9];
            case 8:
                error_1 = _b.sent();
                res.status(401).send({ message: 'something wrong while creating Post. try again Please.', error: error_1 });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); }));
router.delete('/main/:commentid', (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentid, _id, targetComment, targetreComment, parentIdOfReply;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('saefaeijsofjsoifajesofijasfoiasjoiesajfoisaejfoiesfjoseijfoaesifjoseaifjosaefjeosao');
                if (!req.user) return [3 /*break*/, 13];
                commentid = req.params.commentid;
                _id = req.user._id;
                return [4 /*yield*/, commentSchema_1.CommentModel.findById(commentid)];
            case 1:
                targetComment = _a.sent();
                return [4 /*yield*/, commentSchema_1.reCommentModel.findById(commentid)];
            case 2:
                targetreComment = _a.sent();
                if (!targetComment) return [3 /*break*/, 6];
                if (!(targetComment.author === _id.toString())) return [3 /*break*/, 5];
                return [4 /*yield*/, commentSchema_1.CommentModel.findByIdAndDelete(commentid)];
            case 3:
                _a.sent();
                return [4 /*yield*/, userSchema_1.User.findByIdAndUpdate(_id, { $pull: { comments: commentid } }, { new: true })
                        .then(function (updatedUser) {
                        req.flash('good', 'Deleted Post successfully');
                        var messages = req.flash('good');
                        res.status(200).send({ message: messages[0], type: 'comment' });
                    })
                        .catch(function (err) {
                        req.flash('bad', 'Something wrong deleting Post!');
                        var messages = req.flash('bad');
                        res.status(401).send({ message: messages[0] });
                    })];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5: return [2 /*return*/, res.status(403).json({ error: 'You do not have permission to delete this comment.' })];
            case 6:
                if (!targetreComment) return [3 /*break*/, 12];
                parentIdOfReply = targetreComment.parentId;
                if (!(targetreComment.author === _id.toString())) return [3 /*break*/, 11];
                return [4 /*yield*/, commentSchema_1.reCommentModel.findByIdAndDelete(commentid)];
            case 7:
                _a.sent();
                return [4 /*yield*/, commentSchema_1.reCommentModel.findByIdAndUpdate(parentIdOfReply, { $pull: { replies: commentid } }, { new: true })];
            case 8:
                _a.sent();
                return [4 /*yield*/, commentSchema_1.CommentModel.findByIdAndUpdate(parentIdOfReply, { $pull: { comments: commentid } }, { new: true })];
            case 9:
                _a.sent();
                return [4 /*yield*/, userSchema_1.User.findByIdAndUpdate(parentIdOfReply, { $pull: { comments: commentid } }, { new: true })
                        .then(function (updatedUser) {
                        console.log('3', updatedUser);
                        req.flash('good', 'Deleted Comment Successfully');
                        var messages = req.flash('good');
                        res.status(200).send({ message: messages[0], type: 'reply' });
                    })
                        .catch(function (err) {
                        req.flash('bad', 'Something wrong deleting comment!');
                        var messages = req.flash('bad');
                        res.status(401).send({ message: messages[0] });
                    })];
            case 10:
                _a.sent();
                return [3 /*break*/, 12];
            case 11: return [2 /*return*/, res.status(403).json({ error: 'You do not have permission to delete this recomment.' })];
            case 12: return [3 /*break*/, 14];
            case 13: return [2 /*return*/, res.status(401).json({ message: 'Unauthorized' })];
            case 14: return [2 /*return*/];
        }
    });
}); }));
router.get('/main/reply/:Id/:skip', isLoggedIn_1.isLoggedIn, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, Id, skip, data, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.params, Id = _a.Id, skip = _a.skip;
                console.log('parentId', Id);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 11, , 12]);
                data = void 0;
                if (!skip) return [3 /*break*/, 6];
                return [4 /*yield*/, commentSchema_1.CommentModel.findById(Id).populate({
                        path: 'comments',
                        options: {
                            sort: { 'updatedAt': -1 }, // sort by updatedAt in descending order
                            skip: Number(skip), // skip a number of documents
                            limit: 10
                        }
                    })];
            case 2:
                data = _c.sent();
                if (!data) return [3 /*break*/, 3];
                res.status(200).send({ data: data, type: 'comment' });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, commentSchema_1.reCommentModel.findById(Id).populate({
                    path: 'replies',
                    options: {
                        sort: { 'updatedAt': -1 }, // sort by updatedAt in descending order
                        skip: Number(skip), // skip a number of documents
                        limit: 10
                    }
                })];
            case 4:
                data = _c.sent();
                if (data) {
                    res.status(200).send({ data: data, type: 'reply' });
                }
                else {
                    res.status(200).send({ meesage: 'Your post was sent.' });
                }
                _c.label = 5;
            case 5: return [3 /*break*/, 10];
            case 6: return [4 /*yield*/, commentSchema_1.CommentModel.findById(Id).sort({ updatedAt: -1 }).limit(20)];
            case 7:
                data = _c.sent();
                if (!data) return [3 /*break*/, 8];
                res.status(200).send({ data: data, type: 'comment' });
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, commentSchema_1.reCommentModel.findById(Id).sort({ updatedAt: -1 }).limit(20)];
            case 9:
                data = _c.sent();
                if (data) {
                    res.status(200).send({ data: data, type: 'reply' });
                }
                else {
                    res.status(200).send({ meesage: 'Your post was sent.' });
                }
                _c.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                _b = _c.sent();
                console.log('error during get replies');
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); }));
router.get('/main/getCommentInfo/:Id', isLoggedIn_1.isLoggedIn, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var Id, _a, _id, username, data, userData, arrayOfLiked, stringsArray, isLiked, totalData, data_1, userData, arrayOfLiked, stringsArray, isLiked, totalData, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                Id = req.params.Id;
                console.log('parentId', Id);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 10, , 11]);
                if (!req.user) return [3 /*break*/, 8];
                _a = req.user, _id = _a._id, username = _a.username;
                return [4 /*yield*/, commentSchema_1.CommentModel.findById(Id)]; //check,  data is post or comment
            case 2:
                data = _c.sent() //check,  data is post or comment
                ;
                if (!data) return [3 /*break*/, 4];
                return [4 /*yield*/, userSchema_1.User.findById(data.author)];
            case 3:
                userData = _c.sent();
                console.log('sfsefesf', userData, data, 'only possible');
                arrayOfLiked = data.like;
                stringsArray = arrayOfLiked.map(function (x) { return x.toString(); });
                isLiked = stringsArray.includes(_id.toString());
                console.log('check this', stringsArray, _id, isLiked);
                totalData = { data: data, type: 'comment', isLiked: isLiked, userData: userData };
                res.status(200).send({ totalData: totalData });
                return [3 /*break*/, 7];
            case 4: return [4 /*yield*/, commentSchema_1.reCommentModel.findById(Id)];
            case 5:
                data_1 = _c.sent();
                if (!data_1) return [3 /*break*/, 7];
                return [4 /*yield*/, userSchema_1.User.findById(data_1.author)];
            case 6:
                userData = _c.sent();
                arrayOfLiked = data_1.like;
                stringsArray = arrayOfLiked.map(function (x) { return x.toString(); });
                isLiked = stringsArray.includes(_id.toString());
                totalData = { data: data_1, type: 'reply', isLiked: isLiked, userData: userData };
                res.status(200).send({ totalData: totalData });
                _c.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                console.log('login please');
                _c.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                _b = _c.sent();
                console.log('error during get replies');
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); }));
router.patch('/main/edit/:Id', isLoggedIn_1.isLoggedIn, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var Id, updateText, _a, _id, username, LoginedUserId, isComment, postAuthor, messages, GetcommentAwait, messages, error_2, messages;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                Id = req.params.Id;
                updateText = req.body.updateText;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                if (!req.user) return [3 /*break*/, 10];
                _a = req.user, _id = _a._id, username = _a.username;
                LoginedUserId = _id.toString();
                return [4 /*yield*/, commentSchema_1.CommentModel.findById(Id)]; // if true it's a comment
            case 2:
                isComment = _b.sent() // if true it's a comment
                ;
                if (!isComment) return [3 /*break*/, 6];
                postAuthor = isComment.author;
                console.log('불법행위', LoginedUserId);
                if (!(LoginedUserId === postAuthor)) return [3 /*break*/, 4];
                return [4 /*yield*/, commentSchema_1.CommentModel.findByIdAndUpdate(Id, { $set: { content: updateText } }, { new: true })];
            case 3:
                _b.sent();
                req.flash('good', 'Post Edit successful!');
                messages = req.flash('good');
                res.status(200).send({ message: messages[0], type: 'comments', test: updateText });
                return [3 /*break*/, 5];
            case 4: throw Error;
            case 5: return [3 /*break*/, 10];
            case 6: return [4 /*yield*/, commentSchema_1.reCommentModel.findById(Id)];
            case 7:
                GetcommentAwait = _b.sent();
                if (!(LoginedUserId === GetcommentAwait.author)) return [3 /*break*/, 9];
                return [4 /*yield*/, commentSchema_1.reCommentModel.findByIdAndUpdate(Id, { $set: { content: updateText } }, { new: true })];
            case 8:
                _b.sent();
                req.flash('good', 'Comment Edit successful!');
                messages = req.flash('good');
                res.status(200).send({ message: messages[0], type: 'reply', parentId: GetcommentAwait.parentId, test: updateText });
                return [3 /*break*/, 10];
            case 9: throw Error;
            case 10: return [3 /*break*/, 12];
            case 11:
                error_2 = _b.sent();
                messages = req.flash('bad');
                req.flash('bad', 'something wrong Editing comment');
                res.status(401).send({ message: messages[0] });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); }));
router.post('/main/reply', isLoggedIn_1.isLoggedIn, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, todoText, parentId, _b, _id, username, GetUserFromId, data, AddreCommentModel, reCoomentObjecct, reCoomentObjecctId, isComment, messages, error_3, messages;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, req.body];
            case 1:
                _a = _c.sent(), todoText = _a.todoText, parentId = _a.parentId;
                _c.label = 2;
            case 2:
                _c.trys.push([2, 11, , 12]);
                if (!req.user) return [3 /*break*/, 10];
                _b = req.user, _id = _b._id, username = _b.username;
                return [4 /*yield*/, userSchema_1.User.findById(_id)];
            case 3:
                GetUserFromId = _c.sent();
                data = { content: todoText, writer: username, author: _id, profileImg: GetUserFromId.profileImg, parentId: parentId };
                AddreCommentModel = new commentSchema_1.reCommentModel(data);
                return [4 /*yield*/, AddreCommentModel.save()];
            case 4:
                reCoomentObjecct = _c.sent();
                reCoomentObjecctId = reCoomentObjecct._id;
                console.log('5', AddreCommentModel);
                return [4 /*yield*/, commentSchema_1.CommentModel.findById(parentId)]; // if true it's a comment
            case 5:
                isComment = _c.sent() // if true it's a comment
                ;
                if (!isComment) return [3 /*break*/, 7];
                return [4 /*yield*/, commentSchema_1.CommentModel.findByIdAndUpdate(parentId, { $push: { comments: reCoomentObjecctId } }, { new: true })];
            case 6:
                _c.sent();
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, commentSchema_1.reCommentModel.findByIdAndUpdate(parentId, { $push: { replies: reCoomentObjecctId } }, { new: true })];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9:
                req.flash('good', 'Comment Post successful!');
                messages = req.flash('good');
                res.status(200).send({ message: messages[0] });
                _c.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                error_3 = _c.sent();
                messages = req.flash('bad');
                req.flash('bad', 'something wrong posting comment');
                res.status(401).send({ message: messages[0] });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); }));
router.post('/main/like/:type/:commentId', isLoggedIn_1.isLoggedIn, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, commentId, _b, _id, username, data, userData, arrayOfLiked, stringsArray, isLiked, updatedComment, totalData, updatedComment, totalData, data, userData, arrayOfLiked, stringsArray, isLiked, updatedComment, totalData, updatedComment, totalData, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.params, type = _a.type, commentId = _a.commentId;
                console.log(req.user, 'whywhy');
                _d.label = 1;
            case 1:
                _d.trys.push([1, 17, , 18]);
                if (!req.user) return [3 /*break*/, 15];
                _b = req.user, _id = _b._id, username = _b.username;
                if (!(type === 'comment')) return [3 /*break*/, 8];
                return [4 /*yield*/, commentSchema_1.CommentModel.findById(commentId)];
            case 2:
                data = _d.sent();
                if (!data) return [3 /*break*/, 7];
                return [4 /*yield*/, userSchema_1.User.findById(data.author)];
            case 3:
                userData = _d.sent();
                arrayOfLiked = data.like;
                stringsArray = arrayOfLiked.map(function (x) { return x.toString(); });
                isLiked = stringsArray.includes(_id.toString());
                if (!isLiked) return [3 /*break*/, 5];
                return [4 /*yield*/, commentSchema_1.CommentModel.findByIdAndUpdate(commentId, { $pull: { like: _id } }, { new: true })];
            case 4:
                updatedComment = _d.sent();
                totalData = { data: updatedComment, type: 'comment', isLiked: !isLiked, userData: userData };
                res.status(200).send({ totalData: totalData });
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, commentSchema_1.CommentModel.findByIdAndUpdate(commentId, { $push: { like: _id } }, { new: true })];
            case 6:
                updatedComment = _d.sent();
                totalData = { data: updatedComment, type: 'comment', isLiked: !isLiked, userData: userData };
                res.status(200).send({ totalData: totalData });
                _d.label = 7;
            case 7: return [3 /*break*/, 14];
            case 8: return [4 /*yield*/, commentSchema_1.reCommentModel.findById(commentId)];
            case 9:
                data = _d.sent();
                if (!data) return [3 /*break*/, 14];
                return [4 /*yield*/, userSchema_1.User.findById(data.author)];
            case 10:
                userData = _d.sent();
                arrayOfLiked = data.like;
                stringsArray = arrayOfLiked.map(function (x) { return x.toString(); });
                isLiked = stringsArray.includes(_id.toString());
                if (!isLiked) return [3 /*break*/, 12];
                return [4 /*yield*/, commentSchema_1.reCommentModel.findByIdAndUpdate(commentId, { $pull: { like: _id } }, { new: true })];
            case 11:
                updatedComment = _d.sent();
                totalData = { data: updatedComment, type: 'reply', isLiked: !isLiked, userData: userData };
                res.status(200).send({ totalData: totalData });
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, commentSchema_1.reCommentModel.findByIdAndUpdate(commentId, { $push: { like: _id } }, { new: true })];
            case 13:
                updatedComment = _d.sent();
                totalData = { data: updatedComment, type: 'reply', isLiked: !isLiked, userData: userData };
                res.status(200).send({ totalData: totalData });
                _d.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15: return [2 /*return*/, res.status(401).json({ message: 'Unauthorized' })];
            case 16: return [3 /*break*/, 18];
            case 17:
                _c = _d.sent();
                res.status(401).send({ message: 'something wrong while creating Post. try again Please.' });
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); }));
var recommentArray = [];
function findParent(parentId) {
    return __awaiter(this, void 0, void 0, function () {
        var recomment, postComment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!parentId) return [3 /*break*/, 4];
                    return [4 /*yield*/, commentSchema_1.reCommentModel.findById(parentId)];
                case 1:
                    recomment = _a.sent();
                    if (!(recomment && recomment.parentId !== null)) return [3 /*break*/, 2];
                    recommentArray.unshift(recomment);
                    return [2 /*return*/, findParent(recomment.parentId)];
                case 2:
                    if (!(recomment === null)) return [3 /*break*/, 4];
                    return [4 /*yield*/, commentSchema_1.CommentModel.findById(parentId)];
                case 3:
                    postComment = _a.sent();
                    console.log('감문어7', postComment);
                    if (postComment) {
                        recommentArray.unshift(postComment);
                        return [2 /*return*/];
                    }
                    else {
                        console.log('something wrong');
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
router.get('/sendOPtions/:username/:stateOfMenu/:skip', (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, stateOfMenu, skip, getUserInfo, getUserId, totalCount, Replies, getUserInfo, getUserId, totalCount, Post;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, username = _a.username, stateOfMenu = _a.stateOfMenu, skip = _a.skip;
                if (!(stateOfMenu === 'Replies')) return [3 /*break*/, 4];
                return [4 /*yield*/, userSchema_1.User.find({ username: username })];
            case 1:
                getUserInfo = _b.sent();
                getUserId = getUserInfo[0]._id;
                return [4 /*yield*/, commentSchema_1.reCommentModel.find({ author: getUserId })];
            case 2:
                totalCount = (_b.sent()).length;
                return [4 /*yield*/, commentSchema_1.reCommentModel.find({ author: getUserId }).sort({ updatedAt: -1 }).skip(Number(skip)).limit(5)];
            case 3:
                Replies = _b.sent();
                if (Replies) {
                    res.status(200).json({ info: Replies, type: 'Replies', numberOfArray: totalCount });
                }
                else {
                    res.status(200).json({ info: null });
                }
                return [3 /*break*/, 8];
            case 4:
                if (!(stateOfMenu === 'Post')) return [3 /*break*/, 8];
                return [4 /*yield*/, userSchema_1.User.find({ username: username })];
            case 5:
                getUserInfo = _b.sent();
                getUserId = getUserInfo[0]._id;
                return [4 /*yield*/, commentSchema_1.CommentModel.find({ author: getUserId })];
            case 6:
                totalCount = (_b.sent()).length;
                return [4 /*yield*/, commentSchema_1.CommentModel.find({ author: getUserId }).sort({ updatedAt: -1 }).skip(Number(skip)).limit(5)];
            case 7:
                Post = _b.sent();
                if (Post) {
                    res.status(200).json({ info: Post, type: 'Post', numberOfArray: totalCount });
                }
                else {
                    res.status(200).json({ info: null });
                }
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); }));
router.get('/getParentInfo/:parentId', (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parentId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                parentId = req.params.parentId;
                recommentArray = [];
                return [4 /*yield*/, findParent(parentId)];
            case 1:
                _a.sent();
                console.log('aaaaaaa', recommentArray);
                res.status(200).send({ recommentArray: recommentArray });
                return [2 /*return*/];
        }
    });
}); }));
router.get('/main/getReply/:commentId', isLoggedIn_1.isLoggedIn, (0, errorHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, targetComment, data, data_2, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                commentId = req.params.commentId;
                return [4 /*yield*/, commentSchema_1.CommentModel.findById(commentId)];
            case 1:
                targetComment = _b.sent();
                if (!targetComment) return [3 /*break*/, 8];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 7, , 8]);
                return [4 /*yield*/, commentSchema_1.CommentModel.findById(commentId).populate('comments')];
            case 3:
                data = _b.sent();
                if (!data) return [3 /*break*/, 4];
                res.status(200).send({ info: data });
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, commentSchema_1.reCommentModel.findById(commentId).populate('replies')];
            case 5:
                data_2 = _b.sent();
                if (data_2) {
                    res.status(200).send({ info: data_2 });
                }
                else {
                    res.status(200).send({ info: data_2 });
                }
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                _a = _b.sent();
                console.log('error during get replies');
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); }));
exports.default = router;
