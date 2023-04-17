import { gql } from "@apollo/client";

const FRIEND_REQUEST = gql`
  subscription FriendSub {
    addFriend {
      from {
        username
        name
        avatar
      }
      to {
        username
        name
        avatar
      }
    }
  }
`;

export default FRIEND_REQUEST;
