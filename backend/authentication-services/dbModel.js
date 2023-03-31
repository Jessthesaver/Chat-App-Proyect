import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authenticationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

authenticationSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

authenticationSchema.pre("save", async function (next) {
    const user = this;
    const hashed = await bcrypt.hash(user.password, 10);
    user.password = hashed;
    next();
});

const authenticationModel = mongoose.model("User", authenticationSchema)
export default authenticationModel;