import express, { Express } from "express";
import morgan, { Morgan } from "morgan";
import mongoose, { Connection, mongo } from "mongoose";
import dotenv from "dotenv";
import cors, {CorsOptions} from "cors";
import userRouter from "./routes/userRouter";


// declare application
dotenv.config()
const app: Express = express()
const port: number = parseInt(process.env.PORT as string)


// connect to mongoDB database
mongoose.connect(process.env.MONGODB as string);
mongoose.Promise = Promise;
const db: Connection = mongoose.connection

db.on("connected", console.log.bind(console, `Connected to MongoDB`))
db.on("Error", console.error.bind(console, `Connection to MongoDB failed`))


// configure cross-origin access
const corsOptions: CorsOptions = {
    origin: process.env.CLIENT_ORIGIN as string,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


// APP configuration
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan("dev"));

// Routes
app.use("/user", userRouter);


// startup
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
});
