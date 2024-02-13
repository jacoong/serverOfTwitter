"use strict";
// uploadConfig.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var uuid_1 = require("uuid");
var upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        filename: function (req, file, done) {
            var randomID = (0, uuid_1.v4)();
            var ext = path_1.default.extname(file.originalname);
            var filename = randomID + ext;
            console.log(filename);
            done(null, filename);
        },
        destination: function (req, file, done) {
            console.log(file);
            done(null, path_1.default.join(__dirname, "public/profileImg"));
        },
    }),
    limits: { fileSize: 1024 * 1024 },
});
exports.default = upload;
