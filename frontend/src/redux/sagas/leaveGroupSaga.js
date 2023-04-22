import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { setUser } from "../reducers/userSlice";
import { CORE_USER_FIELDS } from "../../graphql/userFragmentGql";

function* leaveGroup(action) {
  const options = {
    mutation: gql`
      ${CORE_USER_FIELDS}
      mutation LeaveGroup($roomInput: RoomInput) {
        leaveGroup(roomInput: $roomInput) {
          success
          errorMessage
          value {
            ...CoreUserFields
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
