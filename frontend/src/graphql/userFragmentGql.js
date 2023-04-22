import { gql } from "@apollo/client";

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    _id
    email
    avatar
    friendsList {
      avatar
      email
      joinedAt
      name
      username
    }
    name
    rooms {
      _id
      admin {
        joinedAt
        avatar
        email
        name
        username
      }
      groupalChat
      isDeleted
      members {
        email
        avatar
        joinedAt
        name
        username
      }
      name
    }
    requests {
      from {
        avatar
        email
        joinedAt
        name
        username
      }
      to {
        avatar
        email
        joinedAt
        name
        username
      }
    }
    settings {
      language
    }
    username
  }
`;
