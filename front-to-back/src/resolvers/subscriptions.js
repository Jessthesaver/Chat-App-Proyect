import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

const subscriptions = {
  newMessage: {
    subscribe: () => pubSub.asyncIterator("MESSAGE_CREATED"),
  },
  newRoom: {
    subscribe: () => pubSub.asyncIterator("ROOM_CREATED"),
  },
  addFriend: {
    subscribe: () => pubSub.asyncIterator("FRIEND_REQUEST"),
  },
  friendRequestAccepted: {
    subscribe: () => pubSub.asyncIterator(`FRIEND_REQUEST_ACCEPTED`),
  },
  deleteContact: {
    subscribe: () => pubSub.asyncIterator(`CONTACT_DELETED`),
  },
  groupChanged: {
    subscribe: () => pubSub.asyncIterator(`GROUP_CHANGED`),
  },
};

export default subscriptions;
