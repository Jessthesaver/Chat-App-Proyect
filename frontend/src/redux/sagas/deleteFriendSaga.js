import { put, call } from "redux-saga/effects";
import { gql } from "@apollo/client";
import client from "../../client";
import { deleteContact } from "../reducers/userSlice";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { USER_FIELDS } from "../../graphql/userFragmentGql";

function* deleteFriend(action) {
  const options = {
    mutation: gql`
      ${USER_FIELDS}
      mutation DeleteFriend($friendInput: FriendInput) {
        deleteFriend(friendInput: $friendInput) {
          success
          errorMessage
          value {
            ...UserFields
          }
        }
      }
    `,
    variables: action.payload,
    fetchPolicy: "no-cache",
  };
  try {
    const res = yield call(client.mutate, options);
    const value = res.data.deleteFriend.value;

    yield put(deleteContact(value));
  } catch (error) {
    yield put(setDefaultNotification());
  }
}

export default deleteFriend;
