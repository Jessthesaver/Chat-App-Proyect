import { Router } from "express";
import messageModel from "./dbMessageModel.js";

const router = Router();

router.post('/createMessage', async (req, res) => {
    try {
        const { body } = req;
        const message = await messageModel.create(body);

        return res.status(201).send({ message });
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const message = await chatModel.findById({ _id });

        if (!message) return res.status(404).send('Message not Found');

        return res.status(200).send(message);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.get('/messagesOfChatRoom/:id', async (req, res) => {
    const { id: chatId } = req.params;

    try {
        const chatMessages = await messageModel.find({ chatId });

        if (!chatMessages) {
            return res.status(404).send("Conversation not Found");
        };

        return res.status(200).send(chatMessages);
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.delete('/deleteMessage/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const message = await messageModel.findById({ _id });

        if (!message) {
            return res.status(404).send({ message: 'Message not found' });
        }

        message.deleteOne();

        return res.status(200).send(message);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.delete('/deleteAllChatRoomMessages/:id', async (req, res) => {
    const chatId = req.params.id;

    try {
        const deleted = await messageModel.deleteMany({ chatId: chatId });

        return res.status(200).send(deleted)
    } catch (err) {
        return res.status(500).send(err.message);
    }


});

export default router;