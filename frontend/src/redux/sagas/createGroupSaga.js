import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setGroupRoom } from "../reducers/userSlice";
import { CORE_ROOM_FIELDS } from "../../graphql/groupFragmentGql";

function* createGroup(action) {
  const options = {
    mutation: gql`
      ${CORE_ROOM_FIELDS}
      mutation createChatRoom($roomInput: RoomInput) {
        createChatRoom(roomInput: $roomInput) {
          ...CoreRoomFields
        }
      }
    `,
    variables: {
      roomInput: action.payload.roomInput,
    },
    fetchPolicy: "no-cache",
  };

  const res = yield call(client.mutate, options);

  const value = res.data.createChatRoom;

  yield put(setGroupRoom(value));
}

export default createGroup;
