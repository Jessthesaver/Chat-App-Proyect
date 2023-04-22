import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { removeMember } from "../reducers/userSlice";
import { CORE_ROOM_FIELDS } from "../../graphql/groupFragmentGql";

function* deleteMember(action) {
  const options = {
    mutation: gql`
      ${CORE_ROOM_FIELDS}
      mutation deleteMember($roomInput: RoomInput) {
        deleteMember(roomInput: $roomInput) {
          ...CoreRoomFields
        }
      }
    `,
    variables: action.payload,
  };

  try {
    const res = yield call(client.mutate, options);

    yield put(removeMember(res.data));
  } catch (error) {
    yield put(setDefaultNotification());
  }
}

export default deleteMember;
