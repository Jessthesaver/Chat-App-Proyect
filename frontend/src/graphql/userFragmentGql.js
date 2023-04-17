import { gql } from "@apollo/client";

export const USER_FIELDS = gql`
  fragment UserFields on User {
    username
    name
    email
    settings {
      language
    }
    requests {
      from {
        username
        mame
        avatar
      }
      to {
        username
        name
        avatar
      }
    }
    avatar
    friendsList {
      username
      avatar
      name
      email
    }
    rooms {
      _id
      name
      admin {
        username
      }
      groupalChat
      members {
        username
        name
        avatar
        joinedAt
      }
    }
  }
`;
