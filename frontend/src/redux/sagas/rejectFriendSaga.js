import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { rejectFriend } from "../reducers/userSlice";
import { USER_FIELDS } from "../../graphql/userFragmentGql";

function* rejectContact(action) {
  const options = {
    mutation: gql`
      ${USER_FIELDS}
      mutation rejectFriend($friendInput: FriendInput) {
        rejectFriend(friendInput: $friendInput) {
          success
          errorMessage
          value {
            ...UserFields
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
