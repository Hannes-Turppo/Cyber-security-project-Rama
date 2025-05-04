import {body} from 'express-validator';

const registerValidators = () => {
    const usernameMessage: string = "Username must be at least 4 characters long";
    const passwordMessage: string = "Password must be at least 8 characters long and include uppercase and lowercase letters, numbers and special characters (#!&?)";

    return [
        body("username").escape().trim().isLength({min: 4}).withMessage(usernameMessage),
        body("password")
            .escape()
            .isLength({min: 8}).withMessage(passwordMessage)
            .matches(/[A-Z]/).withMessage(passwordMessage)
            .matches(/[a-z]/).withMessage(passwordMessage)
            .matches(/[0-9]/).withMessage(passwordMessage)
            .matches(/[#!&?]/).withMessage(passwordMessage),
    ]
};

const loginValidators = () => {
    const emailMessage: string = "Provide a valid email";

    return [
        body("username").escape().trim().isEmail().withMessage(emailMessage),
        body("password").escape()
    ]
};

export { registerValidators, loginValidators };