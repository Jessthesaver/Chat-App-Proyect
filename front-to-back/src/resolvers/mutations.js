import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import validate from "validator";

const pubSub = new PubSub();

const mutations = {
  createUser: async (parent, { userInput }, { dataSources }) => {
    const { username, name, password, confirmPassword, email } = userInput;

    const isValidEmail = validate.isEmail(String(email).toLocaleLowerCase());

    userInput.avatar = createAvatar(adventurer, {
      seed: `${name.split(" ")[0]}`,
      dataUri: true,
      size: 1280,
    });
    const svg = userInput.avatar.toDataUriSync();

    const isValidPassword = validate.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: true,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    });

    if (
      isValidPassword < 50 ||
      password !== confirmPassword ||
      !isValidEmail ||
      username.trim().length > 25 ||
      name.trim().length > 25 ||
      email.trim().length > 80 ||
      password.trim().length > 80 ||
      confirmPassword.trim().length > 80
    ) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_USER_INPUT",
          http: { status: 400 },
        },
      });
    }

    try {
      const userProfile = await dataSources.userAPI.createUser(
        username,
        name,
        email,
        svg
      );
      const signup = await dataSources.authAPI.signup(username, password);

      return { success: true, errorMessage: null };
    } catch (err) {
      if (err.extensions.response.body.error.keyValue.email) {
        throw new GraphQLError("The email has been used");
      } else if (err.extensions.response.body.error.keyValue.username) {
        throw new GraphQLError("The username has been taked");
      }
    }
  },
  login: async (parent, { userInput }, { dataSources, req, res }) => {
    if (userInput.username.length > 25 || userInput.password.length > 80) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_USER_INPUT",
          http: { status: 400 },
        },
      });
    }
    try {
      const auth = await dataSources.authAPI.login(userInput);
      const user = await dataSources.userAPI.getUser(userInput);

      const { token } = auth;

      const options = {
        maxAge: 1e9,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };

      res.cookie("JWT", token, options);

      const roomsArray = user.user.rooms.map(async (room) => {
        const newRoom = await dataSources.chatAPI.getChatRoom(room._id);

        if (newRoom) {
          room = newRoom;
        }
        return room;
      });

      const completeRooms = await Promise.all(roomsArray);
      user.user.rooms = completeRooms;

      return { ...user.user, token };
    } catch (err) {
      const message = err.extensions.response.body.error;

      throw new GraphQLError(
        message.error
          ? message.error
          : message.message
          ? message.message
          : message
      );
    }
  },
  logout: async (parent, { cookieInput }, { dataSources, req, res }) => {
    const { name } = cookieInput;

    try {
      const options = {
        maxAge: 1e9,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };

      res.clearCookie(name, options);

      return { sucess: true, messageError: null, value: null };
    } catch (err) {
      const message = err.extensions.response.body.error;

      return { sucess: false, messageError: message, value: null };
    }
  },
  createMessage: async (_, { messageInput }, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    if (!messageInput.isScribble && messageInput.content.length > 5000) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_USER_INPUT",
          http: { status: 400 },
        },
      });
    }

    messageInput.sendBy = authUser.username;

    const getBase64StringFromDataURL = (dataURL) =>
      dataURL.replace("data:", "").replace(/^.+,/, "");

    const base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const contentString = getBase64StringFromDataURL(messageInput.content);

    const isScribble =
      messageInput.content.includes("data:image/png;base64") &&
      base64regex.test(contentString);

    if (isScribble !== messageInput.isScribble) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_USER_INPUT",
          http: { status: 400 },
        },
      });
    }

    try {
      const { members } = await dataSources.chatAPI.getChatRoom(
        messageInput.chatId
      );

      const inRoom = members.find(
        (user) => user.username === authUser.username
      );

      if (authUser.username !== messageInput.sendBy || !inRoom) {
        throw new GraphQLError("Internal Error", {
          extensions: {
            code: "BAD_USER_INPUT",
            http: { status: 400 },
          },
        });
      }

      const createdMessage = await dataSources.chatAPI.createMessage(
        messageInput
      );

      pubSub.publish("MESSAGE_CREATED", {
        newMessage: messageInput,
      });

      return createdMessage.message;
    } catch (err) {
      const message = err.extensions.response.body.error;
      throw new GraphQLError(message);
    }
  },
  createChatRoom: async (_, { roomInput }, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    if (!roomInput.groupalChat || roomInput.name.length > 25) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_USER_INPUT",
          http: { status: 400 },
        },
      });
    }

    const isMember = roomInput.members.find(
      (user) => user.username === authUser.username
    );
    const isAdmin = roomInput.admin.find(
      (user) => user.username === authUser.username
    );

    const uniqueMembers = [
      ...new Map(roomInput.members.map((v) => [v.username, v])).values(),
    ];

    roomInput.members = uniqueMembers;
    uniqueMembers.map((user) => {
      if (user.username !== authUser.username) {
        const isContact = authUser.friendsList.find((contact) => {
          return contact === user.username;
        });

        if (!isContact) {
          throw new GraphQLError("Internal Error", {
            extensions: {
              code: "BAD_USER_INPUT",
              http: { status: 400 },
            },
          });
        }
      }
    });

    if (!isMember || !isAdmin) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_USER_INPUT",
          http: { status: 400 },
        },
      });
    }

    try {
      const createdRoom = await dataSources.chatAPI.createChatRoom(roomInput);

      const { _id, members } = createdRoom;

      const updatedUsers = members.map(
        async ({ username }) =>
          await dataSources.userAPI.updateInfo(username, { rooms: { _id } })
      );

      await Promise.all(updatedUsers);

      pubSub.publish(`GROUP_CHANGED`, {
        groupChanged: createdRoom,
      });

      return createdRoom;
    } catch (err) {
      const message = err.extensions.response.body.error;
      throw new GraphQLError(message);
    }
  },

  addMember: async (parent, { roomInput }, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const { _id, members } = roomInput;

    let updatedContact;

    const currentRoom = await dataSources.chatAPI.getChatRoom(_id);

    const isAdmin = currentRoom.admin.find(
      (element) => element.username === authUser.username
    );

    if (!isAdmin) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const updatedRoom = await dataSources.chatAPI.addMember(_id, members);

    const { name, members: updatedMembers } = updatedRoom;

    const usersPromises = members.map(async ({ username }) => {
      updatedContact = await dataSources.userAPI.updateInfo(username, {
        rooms: { _id, name },
      });
      return updatedContact;
    });

    const newMembers = await Promise.all(usersPromises);

    pubSub.publish(`GROUP_CHANGED`, {
      groupChanged: updatedRoom,
    });

    return updatedRoom;
  },

  deleteMember: async (_, { roomInput }, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const { _id, members } = roomInput;

    const currentRoom = await dataSources.chatAPI.getChatRoom(_id);

    const isAdmin = currentRoom.admin.find(
      (element) => element.username === authUser.username
    );

    if (!isAdmin) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const updatedRoom = await dataSources.chatAPI.deleteMember(_id, members);

    await members.map(async ({ username }) => {
      const updatedMember = await dataSources.userAPI.updateInfo(username, {
        rooms: { _id },
      });
      return updatedMember;
    });

    pubSub.publish(`GROUP_CHANGED`, {
      // groupChanged: remainMembers,
      groupChanged: updatedRoom,
    });

    return updatedRoom;
  },
  addFriend: async (_, { friendInput }, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const request = {
      userA: { username: authUser.username },
      userB: { username: friendInput.userB[0].username.trim() },
    };

    if (
      request.userA.username === request.userB.username ||
      request.userA.username !== authUser.username ||
      friendInput.userB[0].username.length > 25
    ) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_USER_INPUT",
          http: { status: 400 },
        },
      });
    }

    try {
      const {
        user: { requests: userBRequests },
      } = await dataSources.userAPI.getUser(friendInput.userB[0].username);

      const alreadyOnRequest = userBRequests.filter((element) => {
        return element.from === request.userA.username;
      });

      if (alreadyOnRequest.length > 0) {
        throw new GraphQLError("Request already sent", {
          extensions: {
            code: "FORBIDDEN",
          },
        });
      }
      const response = await dataSources.userAPI.friendRequest(request);
      const req = {
        from: {
          username: response.from,
        },
        to: {
          username: response.to,
        },
      };

      pubSub.publish("FRIEND_REQUEST", {
        addFriend: req,
      });

      return response;
    } catch (err) {
      const message = err.extensions.response?.body.error
        ? err.extensions.response.body.error
        : err;
      throw new GraphQLError(message);
    }
  },

  acceptFriend: async (parent, { friendInput }, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const request = {
      userA: { username: authUser.username },
      userB: { username: friendInput.userB[0].username },
    };

    if (request.userA.username !== authUser.username) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_USER_INPUT",
          http: { status: 400 },
        },
      });
    }

    try {
      const { updatedUserA, updatedUserB } =
        await dataSources.userAPI.acceptFriend(request);

      const members = [
        { username: updatedUserA.username },
        { username: updatedUserB.username },
      ];
      const roomInput = {
        admin: [
          { username: updatedUserA.username },
          { username: updatedUserB.username },
        ],
        groupalChat: false,
        name: `${updatedUserA.username} and ${updatedUserB.username} conversation`,
        members: members,
      };
      const { _id } = await dataSources.chatAPI.createChatRoom(roomInput);

      const updatedUsers = members.map(async ({ username }) => {
        return await dataSources.userAPI.updateInfo(username, {
          rooms: { _id },
        });
      });

      const values = await Promise.all(updatedUsers);

      pubSub.publish(`FRIEND_REQUEST_ACCEPTED`, {
        friendRequestAccepted: values[1],
      });

      return { success: true, messageError: null, value: values[0] };
    } catch (err) {
      const message = err.extensions.response.body.error;
      return { succes: false, errorMessage: message };
    }
  },

  rejectFriend: async (parent, { friendInput }, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const request = {
      userA: { username: authUser.username },
      userB: { username: friendInput.userB[0].username },
    };

    if (request.userA.username !== authUser.username) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_USER_INPUT",
          http: { status: 400 },
        },
      });
    }

    try {
      const updatedUser = await dataSources.userAPI.rejectFriend(request);

      return { success: false, errorMessage: null, value: updatedUser };
    } catch (err) {
      const message = err.extensions.response.body.error;
      return { success: false, errorMessage: message };
    }
  },

  deleteFriend: async (parent, { friendInput }, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const { userB, chatId } = friendInput;
    const userA = [{ username: authUser.username }];

    if (userA[0].username !== authUser.username) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_USER_INPUT",
          http: { status: 400 },
        },
      });
    }

    try {
      const deletedRoom = await dataSources.chatAPI.deleteRoom(chatId);

      //Erase friend
      const { updatedUserA, updatedUserB } =
        await dataSources.userAPI.deleteFriend({ userA, userB });

      //Erase rooms
      //From main user
      const updatedRooms = updatedUserA.rooms.filter(
        (room) => room._id !== deletedRoom._id
      );
      const updatedUser = await dataSources.userAPI.updateInfo(
        updatedUserA.username,
        { rooms: updatedRooms }
      );

      //From the other user
      const updatedRoomsB = updatedUserB.rooms.filter(
        (room) => room._id !== deletedRoom._id
      );
      const secondaryUser = await dataSources.userAPI.updateInfo(
        updatedUserB.username,
        { rooms: updatedRoomsB }
      );

      //Erase messages
      const deletedMessages =
        await dataSources.chatAPI.deleteAllChatRoomMessages(chatId);

      pubSub.publish(`CONTACT_DELETED`, {
        deleteContact: secondaryUser,
      });

      return { success: true, errorMessage: null, value: updatedUser };
    } catch (err) {
      const message = err.extensions.response.body.error;
      return { success: false, errorMessage: message };
    }
  },

  addAdmin: async (parent, { roomInput }, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const { _id, admin } = roomInput;

    const currentRoom = await dataSources.chatAPI.getChatRoom(_id);

    const isAdmin = currentRoom.admin.find(
      (element) => element.username === authUser.username
    );

    const areMembers = admin.find((user) => {
      const isMember = currentRoom.members.find(
        (element) => element.username === user.username
      );

      if (isMember) {
        return isMember;
      }
    });

    if (!isAdmin || !areMembers) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_REQUEST",
          http: { status: 400 },
        },
      });
    }

    try {
      const updatedRoom = await dataSources.chatAPI.addAdmin(_id, admin);

      const response = admin.map(async ({ username }) => {
        const { user } = await dataSources.userAPI.getUser(username);
        return user;
      });

      const newAdmins = await Promise.all(response);

      pubSub.publish(`GROUP_CHANGED`, {
        groupChanged: updatedRoom,
      });

      return updatedRoom;
    } catch (err) {
      const message = err.extensions.response.body.error;
      return message;
    }
  },
  deleteAdmin: async (parent, { roomInput }, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const { _id, admin } = roomInput;

    const currentRoom = await dataSources.chatAPI.getChatRoom(_id);

    const isAdmin = currentRoom.admin.find(
      (element) => element.username === authUser.username
    );

    if (!isAdmin) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_REQUEST",
          http: { status: 401 },
        },
      });
    }

    try {
      const updatedRoom = await dataSources.chatAPI.deleteAdmin(_id, admin);

      const response = admin.map(async ({ username }) => {
        const { user } = await dataSources.userAPI.getUser(username);
        return user;
      });

      const newAdmins = await Promise.all(response);

      pubSub.publish(`GROUP_CHANGED`, {
        // groupChanged: newAdmins,
        groupChanged: updatedRoom,
      });

      return updatedRoom;
    } catch (err) {
      const message = err.extensions.response.body.error;
      return message;
    }
  },
  leaveGroup: async (parent, { roomInput }, { dataSources, authUser }) => {
    let removedFromAdmin, removedFromMembers;
    const { _id, admin, members } = roomInput;

    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const currentRoom = await dataSources.chatAPI.getChatRoom(_id);

    const isMember = currentRoom.members.find(
      (element) => element.username === authUser.username
    );

    if (!isMember || members[0].username !== authUser.username) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "BAD_REQUEST",
          http: { status: 401 },
        },
      });
    }

    try {
      if (admin) {
        removedFromAdmin = dataSources.chatAPI.deleteAdmin(_id, admin);
        removedFromMembers = dataSources.chatAPI.deleteMember(_id, members);

        await Promise.all([removedFromAdmin, removedFromMembers]);
      } else if (!admin) {
        await dataSources.chatAPI.deleteMember(_id, members);
      }

      const updatedRoom = await dataSources.chatAPI.getChatRoom(_id);

      pubSub.publish(`GROUP_CHANGED`, {
        groupChanged: updatedRoom,
      });

      const updatedUser = await dataSources.userAPI.updateInfo(
        members[0].username,
        { rooms: { _id } }
      );

      return { success: true, errorMessage: null, value: updatedUser };
    } catch (err) {
      const message = err.extensions.response.body.error;
      return { success: false, errorMessage: message };
    }
  },
  deleteRoom: async (parent, { roomInput }, { dataSources, authUser }) => {
    const { _id, members: currentUser } = roomInput;

    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const currentRoom = await dataSources.chatAPI.getChatRoom(_id);

    const isAdmin = currentRoom.admin.find(
      (element) => element.username === authUser.username
    );

    if (!isAdmin) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    try {
      //delete room
      const deletedRoom = await dataSources.chatAPI.deleteRoom(_id);
      //delete messages
      await dataSources.chatAPI.deleteAllChatRoomMessages(_id);

      const { members } = deletedRoom;

      const promiseMembers = members.map(async (user) => {
        const updatedMember = await dataSources.userAPI.updateInfo(
          user.username,
          { rooms: { _id } }
        );

        return updatedMember;
      });

      const updatedMembers = await Promise.all(promiseMembers);

      const updatedUser = updatedMembers.find(
        (user) => user.username === currentUser[0].username
      );
      deletedRoom.isDeleted = true;

      pubSub.publish(`GROUP_CHANGED`, {
        groupChanged: deletedRoom,
      });

      return { success: true, errorMessage: null, value: updatedUser };
    } catch (err) {
      const message = err.extensions.response.body.error;
      return { success: false, errorMessage: message };
    }
  },

  changeLanguage: async (_, { settingsInput }, { dataSources, authUser }) => {
    const { settings } = settingsInput;

    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    try {
      const updatedUser = await dataSources.userAPI.updateInfo(
        authUser.username,
        { settings }
      );

      return { success: true, errorMessage: null, value: updatedUser };
    } catch (err) {
      const message = err.extensions.response.body.error;

      return { success: false, errorMessage: message };
    }
  },
};

export default mutations;
