import { gql } from "@apollo/client";

const GROUP_CHANGED = gql`
  subscription groupChanged {
    groupChanged {
      _id
      name
      groupalChat
      admin {
        username
      }
      isDeleted
      members {
        username
        avatar
        joinedAt
      }
    }
  }
`;

export default GROUP_CHANGED;
