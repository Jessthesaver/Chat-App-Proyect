import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setGroupRoom } from "../reducers/userSlice";

function* createGroup(action) {
  const options = {
    mutation: gql`
      mutation createChatRoom($roomInput: RoomInput) {
        createChatRoom(roomInput: $roomInput) {
          _id
          name
          groupalChat
          admin {
            username
          }
          members {
            username
            joinedAt
          }
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
