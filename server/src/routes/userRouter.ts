import { Request, Response, Router } from "express"
import { IUser, User } from "../models/User"
import bcrypt from "bcrypt"
import { Result, ValidationError, validationResult } from "express-validator"
import jwt, { JwtPayload } from "jsonwebtoken"
import { registerValidators, loginValidators } from "../validators/userValidators"
import { validateUser, userRequest } from "../middleware/validateToken"
import { decryptCredentials } from "../middleware/decryptTraffic";

// declare router
const userRouter: Router = Router()

// get user information base on token
userRouter.get("/", validateUser, async (req: userRequest, res: Response) => {
    try {
        console.log(req.user)
        if (req.user) {
            const user = await User.findById(req.user._id)
            if (user) {
                return void res.status(200).json({
                    _id: user._id,
                    username: user.username,
                })
            }
            return void res.status(404).json({message: "User not found."})                
        }
        return void res.status(404).json({message: "User not found."})
    } catch (error: any) {
        console.error(error)
        return void res.status(500).json({message: "Server error while fetching user data."})
    }
})

// user registration
userRouter.post("/register", decryptCredentials, registerValidators(), async(req: Request, res: Response) => {
    
    // check for validationErrors
    const validationErrors: Result<ValidationError> = validationResult(req)
    if (!validationErrors.isEmpty()) {
        console.log(`Validation errors: ${validationErrors}`)
        return void res.status(401).json(validationErrors)
    }

    try {
        console.log(req.body)
        // Check if username is in use:
        const existingUser: IUser | null = await User.findOne({username: req.body.username})
        if (existingUser) {
            return void res.status(403).json({message: `Username ${req.body.username} is in use.`})
        }

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        // create and store new user
        await User.create({
            username: req.body.username,
            password: hash
        })
        return void res.status(200).json({message: `User ${req.body.username} created`})

    } catch (error: any) { // error handling
        console.error(error)
        return void res.status(500).json({message: "Server error while registering"})
    }
})

// User login
userRouter.post("/login", decryptCredentials, loginValidators(), async(req: Request, res: Response) => {

    // check for validationErrors
    const validationErrors: Result<ValidationError> = validationResult(req)
    if (!validationErrors.isEmpty()) {
        console.log(`Validation errors: ${validationErrors}`)
        return void res.status(401).json(validationErrors)
    }

    try {
        console.log(req.body)
        // check for correct credentials
        const user: IUser | null = await User.findOne({username: req.body.username});
        if (user && (bcrypt.compareSync(req.body.password, user.password as string))) {
            // if valid credentials:
            console.log("hello world!")            
            // JWT payload
            const jwtPayload: JwtPayload = {
                _id: user._id,
                username: user.username
            };

            // construct JWT and return 200
            const token: string = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {expiresIn: "2h"})
            return void res.status(200).json({success: true, token})
        }

        // base case: invalid credentials
        return void res.status(401).json({message: "Invalid credentials"})
    } catch (error: any) { // error handling
        console.log(error)
        return void res.status(500).json({message: "Server error while logging in"})
    }

})

export default userRouter
