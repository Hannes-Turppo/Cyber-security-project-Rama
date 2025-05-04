"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateUser = (req, res, next) => {
    const token = req.header("authorization")?.split(" ")[1];
    console.log(req.header("authorization"));
    if (!token) {
        res.status(401).json({ message: "Token not found" });
        return;
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token not found" });
        return;
    }
};
exports.validateUser = validateUser;
