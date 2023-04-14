import { Router } from "express";
import chatModel from "./dbChatModel.js";

const router = Router();

router.post("/createChatRoom", async (req, res) => {
  const group = { ...req.body };
  try {
    chatModel.collection.dropIndexes();

    const chat = await chatModel.create(group);

    return res.status(201).send(chat);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.delete("/deleteChatRoom/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const chat = await chatModel.findById({ _id });

    if (!chat) return res.status(404).send({ error: "Chat not found" });

    chat.deleteOne();

    return res.status(200).send(chat);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const chat = await chatModel.findById({ _id });

    if (!chat) return res.status(404).send({ error: "Chat not found" });

    return res.status(200).send(chat);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.patch("/addMember/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const chat = await chatModel.findById({ _id });

    if (!chat) return res.status(404).send({ error: "Chat not found" });

    if (!chat.groupalChat && chat.members.length > 0 && req.body.length > 1)
      return res
        .status(405)
        .send({ error: "Not allowed in one to one conversations" });

    if (!chat.groupalChat && chat.members.length === 0 && req.body.length > 2)
      return res
        .status(405)
        .send({ error: "Not allowed in one to one conversations" });

    const updatedChat = await chatModel.findByIdAndUpdate(
      { _id: chat._id },
      { $push: { members: req.body } },
      { upsert: true, new: true }
    );

    return res.status(201).send(updatedChat);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.patch("/deleteMember/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const chat = await chatModel.findById({ _id });

    if (!chat) return res.status(404).send({ error: "Chat not found" });

    if (!chat.groupalChat)
      return res
        .status(405)
        .send({ error: "Not allowed in one to one conversations" });

    const roomArray = await req.body.map(async (member) => {
      const updatedChat = await chatModel.findByIdAndUpdate(
        { _id: chat._id },
        { $pull: { members: member } },
        { upsert: true, new: true }
      );

      return updatedChat;
    });

    const updatedChat = await chatModel.findById({ _id });
    return res.status(200).send(updatedChat);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.patch("/addAdmin/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const chat = await chatModel.findById({ _id });

    if (!chat) return res.status(404).send({ error: "Chat not found" });

    if (!chat.groupalChat)
      return res
        .status(405)
        .send({ error: "Not allowed in one to one conversations" });

    const roomArray = await req.body.map(async (user) => {
      const updatedChat = await chatModel.findByIdAndUpdate(
        { _id: chat._id },
        { $push: { admin: user } },
        { upsert: true, new: true }
      );

      return updatedChat;
    });

    const updatedChat = await chatModel.findById({ _id });

    return res.status(201).send(updatedChat);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.patch("/deleteAdmin/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const chat = await chatModel.findById({ _id });

    if (!chat) return res.status(404).send({ error: "Chat not found" });

    if (!chat.groupalChat)
      return res
        .status(405)
        .send({ error: "Not allowed in one to one conversations" });

    const roomArray = await req.body.map(async (user) => {
      const updatedChat = await chatModel.findByIdAndUpdate(
        { _id: chat._id },
        { $pull: { admin: user } },
        { upsert: true, new: true }
      );

      return updatedChat;
    });

    const updatedChat = await chatModel.findById({ _id });

    return res.status(201).send(updatedChat);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

export default router;
