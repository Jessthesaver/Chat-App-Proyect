import express from "express";
import UserModel from "./dbModel.js";

const router = express.Router();

router.get("/getUser/:username", async (req, res, next) => {
  const username = req.params.username;

  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).send({ user });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ error: "Invalid body" });
  }
  try {
    const { username, name, email, avatar } = req.body;
    const newUser = await UserModel.create({ username, name, email, avatar });
    return res.status(201).send({ newUser });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.patch("/update/:username", async (req, res) => {
  const username = req.params.username;
  const infoToupdate = req.body;

  try {
    const user = await UserModel.findOne({ username: username });

    if (!user) return res.status(404).send({ error: "User not Found!" });

    for (const key in infoToupdate) {
      if (key === "rooms" && !Array.isArray(infoToupdate[key])) {
        const isRoomExists = user[key].find(
          (room) => room._id === infoToupdate[key]._id
        );

        if (isRoomExists) {
          user[key] = user[key].filter(
            (room) => room._id !== infoToupdate[key]._id
          );
        } else if (!isRoomExists) {
          user[key].push(infoToupdate[key]);
        }
      } else if (key === "rooms" && Array.isArray(infoToupdate[key])) {
        user[key] = infoToupdate[key];
      } else {
        user[key] = infoToupdate[key];
      }
    }
    user.save();
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.delete("/delete/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const user = await UserModel.findOne({ username: username });

    if (!user) return res.status(404).send({ error: "User not Found!" });

    user.remove();
    res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.get("/fieldExistence", async (req, res) => {
  try {
    const field = await UserModel.findOne(req.query);

    if (!field) {
      return res.status(200).send({ exists: false });
    }

    return res.status(200).send({ exists: true });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.patch("/addFriend", async (req, res, next) => {
  try {
    const values = await Promise.all([
      findUser(req.body.userA),
      findUser(req.body.userB),
    ]);
    const userA = values[0];
    const userB = values[1];

    if (!userA || !userB)
      return res.status(404).send({ error: "User(s) not found" });

    if (userA.friendsList.includes(userB.username))
      return res.status(400).send({ error: "Already in contact list" });

    const updatedUserA = await UserModel.findOneAndUpdate(
      { username: userA.username },
      { $push: { friendList: userB.username } },
      { upsert: true, new: true }
    );

    const updatedUserB = await UserModel.findOneAndUpdate(
      { username: userB.username },
      { $push: { friendsList: userA.username } },
      { upsert: true, new: true }
    );

    return res.status(200).send({ updatedUserA, updatedUserB });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.patch("/acceptFriend", async (req, res) => {
  const { userA, userB } = req.body;

  try {
    const user = await UserModel.findOne({ username: userA.username });

    const friend = await UserModel.findOne({ username: userB.username });

    if (!user || !friend)
      return res.status(404).send({ error: "User(s) not found" });

    if (user.friendsList.includes(userB.username)) {
      return res.status(400).send({ error: "Already friends" });
    }

    const updatedUserA = await UserModel.findOneAndUpdate(
      { username: user.username },
      {
        $push: { friendsList: friend.username },
        $pull: { requests: { from: friend.username } },
      },
      { upsert: true, new: true }
    );

    const updatedUserB = await UserModel.findOneAndUpdate(
      { username: friend.username },
      { $push: { friendsList: user.username } },
      { upsert: true, new: true }
    );

    return res.status(200).send({ updatedUserA, updatedUserB });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});

router.post("/friendRequest", async (req, res) => {
  const { userA, userB } = req.body;
  try {
    const user = await UserModel.findOne({ username: userA.username });

    const friend = await UserModel.findOne({ username: userB.username });

    if (!user || !friend)
      return res.status(404).send({ error: "User not found" });

    if (user.friendsList.includes(userB.username)) {
      return res.status(400).send({ error: "Already friends" });
    }

    if (friend.requests.includes(userA.username)) {
      return res.status(400).send({ error: "Request already sent" });
    }

    const friendReq = { from: userA.username, to: userB.username };

    await UserModel.findOneAndUpdate(
      { username: userB.username },
      { $push: { requests: friendReq } },
      { new: true }
    );

    return res.status(200).send(friendReq);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.post("/rejectFriend", async (req, res) => {
  const { userA, userB } = req.body;

  try {
    const user = await UserModel.findOne({ username: userA.username });

    const friend = await UserModel.findOne({ username: userB.username });

    if (!user || !friend)
      return res.status(404).send({ error: "User not found" });

    const updatedUser = await UserModel.findOneAndUpdate(
      { username: userA.username },
      { $pull: { requests: { from: userB.username } } },
      { new: true }
    );

    return res.status(200).send(updatedUser);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.patch("/deleteFriend", async (req, res, next) => {
  try {
    const values = await Promise.all([
      findUser(req.body.userA),
      findUser(req.body.userB),
    ]);
    const userA = values[0];
    const userB = values[1];

    if (!userA || !userB)
      return res.status(404).send({ error: "User(s) not found" });

    const updatedUserA = await UserModel.findOneAndUpdate(
      { username: userA.username },
      { $pull: { friendsList: userB.username } },
      { upsert: false, new: true }
    );

    const updatedUserB = await UserModel.findOneAndUpdate(
      { username: userB.username },
      { $pull: { friendsList: userA.username } },
      { upsert: false, new: true }
    );

    if (!updatedUserA || !updatedUserB)
      return next({ error: "Something went wrong!" });

    return res.status(200).send({ updatedUserA, updatedUserB });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

async function findUser(user) {
  const found = await UserModel.findOne({
    $or: [{ email: user[0].email }, { username: user[0].username }],
  });

  if (!found) return null;

  return found;
}

export { router as userRoutes };
