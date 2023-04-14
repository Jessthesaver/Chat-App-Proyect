import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  admin: {
    type: Array,
    required: true,
  },
  groupalChat: {
    type: Boolean,
    default: false,
  },
  members: [
    {
      type: new mongoose.Schema(
        {
          username: {
            type: String,
            unique: true,
            required: true,
          },
          joinedAt: {
            type: Date,
            default: Date.now(),
          },
        },
        { _id: false }
      ),
    },
  ],
});

const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;
