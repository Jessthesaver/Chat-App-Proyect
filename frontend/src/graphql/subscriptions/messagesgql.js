import { gql } from "@apollo/client";

const MESSAGES_SUBSCRIPTION = gql`
  subscription newMessage($chatId: ID) {
    newMessage(chatId: $chatId) {
      content
      isScribble
      chatId
      sendBy
      createdAt
    }
  }
`;

export default MESSAGES_SUBSCRIPTION;
