import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { removeAdmin } from "../reducers/userSlice";
import { ROOM_FIELDS } from "../../graphql/groupFragmentGql";

function* deleteAdmin(action) {
  const options = {
    mutation: gql`
      ${ROOM_FIELDS}
      mutation deleteAdmin($roomInput: RoomInput) {
        deleteAdmin(roomInput: $roomInput) {
          ...RoomFields
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
