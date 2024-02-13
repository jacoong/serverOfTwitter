"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reCommentModel = exports.CommentModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var commentSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    profileImg: { type: String, required: false },
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'reComment' }],
    like: [{ type: mongoose_1.default.Schema.Types.ObjectId, required: false }],
    isAuthenticated: { type: Boolean, required: true, default: false },
}, { timestamps: true });
var reCommentSchema = new mongoose_1.Schema({
    content: { type: String },
    author: { type: String },
    profileImg: { type: String, required: false },
    parentId: { type: String, required: true },
    replies: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'reComment' }],
    like: [{ type: mongoose_1.Schema.Types.ObjectId, required: false }],
    isAuthenticated: { type: Boolean, required: true, default: false },
}, { timestamps: true });
var CommentModel = (0, mongoose_1.model)('Comment', commentSchema);
exports.CommentModel = CommentModel;
var reCommentModel = (0, mongoose_1.model)('reComment', reCommentSchema);
exports.reCommentModel = reCommentModel;
