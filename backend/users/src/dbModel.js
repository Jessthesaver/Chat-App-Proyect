import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    friendsList: [{
            type: String,
            default: [],
            required: false,
        }],
    avatar: {
        type: String,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    rooms: [Object],
    settings: {
        language: {
            type: String,
            default: "en",
        },
    },
    requests: [{
        type: new mongoose.Schema({
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
                required: true,
            }
        })
    }],
});


const usersModel = mongoose.model("Users", userSchema)
export default usersModel;