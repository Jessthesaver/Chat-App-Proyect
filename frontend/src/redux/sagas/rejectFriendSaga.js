import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { rejectFriend } from "../reducers/userSlice";
import { CORE_USER_FIELDS } from "../../graphql/userFragmentGql";

function* rejectContact(action) {
  const options = {
    mutation: gql`
      ${CORE_USER_FIELDS}
      mutation rejectFriend($friendInput: FriendInput) {
        rejectFriend(friendInput: $friendInput) {
          success
          errorMessage
          value {
            ...CoreUserFields
          }
        }
      }
    `,
    variables: action.payload,
  };

  try {
    const res = yield call(client.mutate, options);

    const user = res.data.rejectFriend?.value;

    yield put(rejectFriend(user));
  } catch (error) {
    yield put(setDefaultNotification());
  }
}

export default rejectContact;
