import {body} from 'express-validator';

const registerValidators = () => {
    const usernameMessage: string = "Username must be at least 4 characters long";
    const passwordMessage: string = "Password must be at least 8 characters long and include uppercase and lowercase letters, numbers and special characters (#!&?)";

    return [
        body("username").escape().trim().isLength({min: 4}).withMessage(usernameMessage),
        body("password").escape()

        // these don't fit the project purpose and inhibit testing.
            // .isLength({min: 8}).withMessage(passwordMessage)
            // .matches(/[A-Z]/).withMessage(passwordMessage)
            // .matches(/[a-z]/).withMessage(passwordMessage)
            // .matches(/[0-9]/).withMessage(passwordMessage)
            // .matches(/[#!&?]/).withMessage(passwordMessage),
    ]
};

const loginValidators = () => {

    return [
        body("username").escape(),
        body("password").escape()
    ]
};

export { registerValidators, loginValidators };