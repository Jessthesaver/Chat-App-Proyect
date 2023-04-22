import { gql } from "@apollo/client";
import { CORE_USER_FIELDS } from "../userFragmentGql.js";

export const FRIEND_REQUEST_ACCEPTED = gql`
  ${CORE_USER_FIELDS}
  subscription friendRequestAccepted {
    friendRequestAccepted {
      ...CoreUserFields
      token
      settings {
        language
      }
    }
  }
`;
