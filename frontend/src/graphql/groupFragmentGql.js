import { gql } from "@apollo/client";

export const CORE_ROOM_FIELDS = gql`
  fragment CoreRoomFields on Room {
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
`;
