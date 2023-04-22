import { gql } from "@apollo/client";
import { CORE_USER_FIELDS } from "../userFragmentGql.js";

const CONTACT_DELETED = gql`
  ${CORE_USER_FIELDS}
  subscription deleteContact {
    deleteContact {
      ...CoreUserFields
      token
      settings {
        language
      }
    }
  }
`;

export default CONTACT_DELETED;
