import { gql } from "@apollo/client";
import { USER_FIELDS } from "../userFragmentGql.js";

export const FRIEND_REQUEST_ACCEPTED = gql`
  ${USER_FIELDS}
  subscription friendRequestAccepted {
    friendRequestAccepted {
      ...UserFields
      token
      settings {
        language
      }
    }
  }
`;
