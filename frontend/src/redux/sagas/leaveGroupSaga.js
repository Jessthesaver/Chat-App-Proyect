import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { setUser } from "../reducers/userSlice";
import { USER_FIELDS } from "../../graphql/userFragmentGql";

function* leaveGroup(action) {
  const options = {
    mutation: gql`
      ${USER_FIELDS}
      mutation LeaveGroup($roomInput: RoomInput) {
        leaveGroup(roomInput: $roomInput) {
          success
          errorMessage
          value {
            ...UserFields
            token
          }
        }
      }
    `,
    variables: action.payload,
  };
  try {
    const res = yield call(client.mutate, options);
    const { value } = res.data.leaveGroup;

    yield put(setUser({ user: value }));
  } catch (error) {
    yield put(setDefaultNotification());
  }
}

export default leaveGroup;
