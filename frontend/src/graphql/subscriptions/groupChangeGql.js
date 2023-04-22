import { gql } from "@apollo/client";
import { CORE_ROOM_FIELDS } from "../groupFragmentGql.js";

const GROUP_CHANGED = gql`
  ${CORE_ROOM_FIELDS}
  subscription groupChanged {
    groupChanged {
      ...CoreRoomFields
    }
  }
`;

export default GROUP_CHANGED;
