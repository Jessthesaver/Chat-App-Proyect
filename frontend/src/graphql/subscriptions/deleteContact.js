import { gql } from "@apollo/client";

const CONTACT_DELETED = gql`
  subscription deleteContact {
    deleteContact {
      username
      name
      email
      avatar
      friendsList {
        username
        name
        email
        avatar
      }
      requests {
        from {
          username
          name
          email
          avatar
        }
        to {
          username
          name
          email
          avatar
        }
      }
      rooms {
        _id
        name
        groupalChat
        admin {
          username
        }
        members {
          username
          name
          email
          joinedAt
          avatar
        }
      }
      token
      settings {
        language
      }
    }
  }
`;

export default CONTACT_DELETED;
