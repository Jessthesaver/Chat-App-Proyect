import { gql } from "@apollo/client";

export const ROOM_FIELDS = gql`
  fragment RoomFields on Room {
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
