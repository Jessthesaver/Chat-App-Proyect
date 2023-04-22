import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { removeAdmin } from "../reducers/userSlice";
import { CORE_ROOM_FIELDS } from "../../graphql/groupFragmentGql";

function* deleteAdmin(action) {
  const options = {
    mutation: gql`
      ${CORE_ROOM_FIELDS}
      mutation deleteAdmin($roomInput: RoomInput) {
        deleteAdmin(roomInput: $roomInput) {
          ...CoreRoomFields
        }
      }
    `,
    variables: action.payload,
  };

  try {
    const res = yield call(client.mutate, options);

    yield put(removeAdmin(res.data));
  } catch (error) {
    yield put(setDefaultNotification());
  }
}

export default deleteAdmin;
