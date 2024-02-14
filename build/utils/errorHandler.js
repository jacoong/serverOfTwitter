"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandler = function (func) {
    return function (req, res, next) {
        func(req, res, next).catch(next);
    };
};
exports.default = errorHandler;
