import { gql } from "@apollo/client";
import { ROOM_FIELDS } from "../groupFragmentGql.js";

const GROUP_CHANGED = gql`
  ${ROOM_FIELDS}
  subscription groupChanged {
    groupChanged {
      ...RoomFields
    }
  }
`;

export default GROUP_CHANGED;
