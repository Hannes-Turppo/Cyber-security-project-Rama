"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidators = exports.registerValidators = void 0;
const express_validator_1 = require("express-validator");
const registerValidators = () => {
    const usernameMessage = "Username must be at least 4 characters long";
    const passwordMessage = "Password must be at least 8 characters long and include uppercase and lowercase letters, numbers and special characters (#!&?)";
    return [
        (0, express_validator_1.body)("username").escape().trim().isLength({ min: 4 }).withMessage(usernameMessage),
        (0, express_validator_1.body)("password")
            .escape()
    ];
};
exports.registerValidators = registerValidators;
const loginValidators = () => {
    return [
        (0, express_validator_1.body)("username").escape(),
        (0, express_validator_1.body)("password").escape()
    ];
};
exports.loginValidators = loginValidators;
