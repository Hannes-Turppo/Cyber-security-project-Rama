"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidators = exports.registerValidators = void 0;
const express_validator_1 = require("express-validator");
const encrypt_rsa_1 = __importDefault(require("encrypt-rsa"));
const registerValidators = () => {
    const usernameMessage = "Username must be at least 4 characters long";
    const passwordMessage = "Password must be at least 8 characters long and include uppercase and lowercase letters, numbers and special characters (#!&?)";
    const nodeRSA = new encrypt_rsa_1.default();
    const decryptedUsername = nodeRSA.decryptStringWithRsaPrivateKey({ text: (0, express_validator_1.body)("username").toString(), privateKey: process.env.RSA_PRIVATE_KEY });
    const decryptedPassword = nodeRSA.decryptStringWithRsaPrivateKey({ text: (0, express_validator_1.body)("password").toString(), privateKey: process.env.RSA_PRIVATE_KEY });
    return [
        (0, express_validator_1.body)("username").escape().trim().isLength({ min: 4 }).withMessage(usernameMessage),
        (0, express_validator_1.body)("password")
            .escape()
            .isLength({ min: 8 }).withMessage(passwordMessage)
            .matches(/[A-Z]/).withMessage(passwordMessage)
            .matches(/[a-z]/).withMessage(passwordMessage)
            .matches(/[0-9]/).withMessage(passwordMessage)
            .matches(/[#!&?]/).withMessage(passwordMessage),
    ];
};
exports.registerValidators = registerValidators;
const loginValidators = () => {
    const emailMessage = "Provide a valid email";
    return [
        (0, express_validator_1.body)("username").escape().trim().isEmail().withMessage(emailMessage),
        (0, express_validator_1.body)("password").escape()
    ];
};
exports.loginValidators = loginValidators;
