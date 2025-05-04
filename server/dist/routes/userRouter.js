"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userValidators_1 = require("../validators/userValidators");
const validateToken_1 = require("../middleware/validateToken");
const userRouter = (0, express_1.Router)();
userRouter.get("/", validateToken_1.validateUser, async (req, res) => {
    try {
        if (req.user) {
            const user = await User_1.User.findById(req.user._id);
            if (user) {
                return void res.status(200).json({
                    _id: user._id,
                    username: user.username,
                });
            }
            return void res.status(404).json({ message: "User not found." });
        }
        return void res.status(404).json({ message: "User not found." });
    }
    catch (error) {
        console.error(error);
        return void res.status(500).json({ message: "Server error while fetching user data." });
    }
});
userRouter.post("/register", (0, userValidators_1.registerValidators)(), async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.log(`Validation errors: ${validationErrors}`);
        return void res.status(401).json(validationErrors);
    }
    try {
        const existingUser = await User_1.User.findOne({ username: req.body.username });
        if (existingUser) {
            return void res.status(403).json({ message: `Username ${req.body.username} is in use.` });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hash = await bcrypt_1.default.hash(req.body.password, salt);
        await User_1.User.create({
            username: req.body.username,
            password: hash
        });
        return void res.status(200).json({ message: `User ${req.body.username} created` });
    }
    catch (error) {
        console.error(error);
        return void res.status(500).json({ message: "Server error while registering" });
    }
});
userRouter.post("/login", (0, userValidators_1.loginValidators)(), async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.log(`Validation errors: ${validationErrors}`);
        return void res.status(401).json(validationErrors);
    }
    try {
        const user = await User_1.User.findOne({ username: req.body.username });
        if (user && (bcrypt_1.default.compareSync(user.password, req.body.password))) {
            const jwtPayload = {
                _id: user._id,
                username: user.username
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "2h" });
            return void res.status(200).json({ success: true, token });
        }
        return void res.status(401).json({ message: "Invalid credentials" });
    }
    catch (error) {
        console.log(error);
        return void res.status(500).json({ message: "Server error while logging in" });
    }
});
userRouter.post("/delete", validateToken_1.validateUser, async (req, res) => {
    try {
        const user = req.user;
        const existingUser = await User_1.User.findById(req.body.id);
        if (!existingUser) {
            return void res.status(400).json({ message: `Bad request` });
        }
        if (existingUser && (user.id === req.body.id)) {
            await User_1.User.deleteOne({ id: req.body.id });
            return void res.status(200).json({ message: `User ${req.body.id} succesfully deleted.` });
        }
        else {
            console.log(`User ${user.id} blocked from deleting user ${req.body.id}`);
            return void res.status(401).json({ message: `Unauthorized` });
        }
    }
    catch (error) {
        console.error(`Error while deleting user: ${error}`);
        return void res.status(500).json({ message: `Error while deleting user` });
    }
});
exports.default = userRouter;
