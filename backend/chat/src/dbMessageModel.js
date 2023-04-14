import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    sendBy: {
        type: String,
        required: true,
    },
    chatId: {
        type: String,
        required: true,
        ref: "Chat",
    },
    isScribble: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });



const messageModel = mongoose.model("Message", messageSchema)
export default messageModel;