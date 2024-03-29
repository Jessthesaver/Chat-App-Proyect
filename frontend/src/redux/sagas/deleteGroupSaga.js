import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { setUser } from "../reducers/userSlice";
import { CORE_USER_FIELDS } from "../../graphql/userFragmentGql";

function* deleteGroup(action) {
  const options = {
    mutation: gql`
      ${CORE_USER_FIELDS}
      mutation DeleteRoom($roomInput: RoomInput) {
        deleteRoom(roomInput: $roomInput) {
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
    const { value } = res.data.deleteRoom;

    yield put(setUser({ user: value }));
  } catch (error) {
    yield put(setDefaultNotification());
  }
}

export default deleteGroup;
