import mongoose, {Document, Schema} from "mongoose"

// create new mongoose model for storing user data in server DB

interface IUser extends Document {
  username: string
  password: string
};

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export { IUser, User };
