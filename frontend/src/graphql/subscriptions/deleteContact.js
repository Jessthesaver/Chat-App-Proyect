import { gql } from "@apollo/client";
import { USER_FIELDS } from "../userFragmentGql.js";

const CONTACT_DELETED = gql`
  ${USER_FIELDS}
  subscription deleteContact {
    deleteContact {
      ...UserFields
      token
      settings {
        language
      }
    }
  }
`;

export default CONTACT_DELETED;
