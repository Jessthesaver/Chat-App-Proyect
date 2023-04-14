import { GraphQLError } from "graphql";

const query = {
  existence: async (_, input, { dataSources }) => {
    const { username, email } = input;

    if (username) {
      const res = await dataSources.userAPI.fieldExistence({ username });

      return { username: res.exists };
    } else if (email) {
      const res = await dataSources.userAPI.fieldExistence({ email });

      return { email: res.exists };
    }
  },
  messages: async (_, { _id }, { dataSources, authUser }) => {
    let isMember;

    if (authUser) {
      const { members } = await dataSources.chatAPI.getChatRoom(_id);

      isMember = members.find((user) => user.username === authUser.username);
    }

    if (!isMember || !authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    if (isMember) {
      const roomMessages = await dataSources.chatAPI.getMessagesOfChatRoom(_id);

      return roomMessages;
    }
  },
  currentUser: async (_, __, { dataSources, authUser }) => {
    if (!authUser) {
      throw new GraphQLError("Internal Error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const roomsArray = authUser.rooms.map(async (chat) => {
      const newRoom = await dataSources.chatAPI.getChatRoom(chat._id);

      if (newRoom) {
        chat = newRoom;
      }
      return chat;
    });

    const completeRooms = await Promise.all(roomsArray);
    authUser.rooms = completeRooms;

    return authUser;
  },
};

export default query;
