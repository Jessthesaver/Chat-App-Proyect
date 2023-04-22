import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { userErrorFetching, newMember } from "../reducers/userSlice";
import { CORE_ROOM_FIELDS } from "../../graphql/groupFragmentGql";

function* addMember(action) {
  const options = {
    mutation: gql`
      ${CORE_ROOM_FIELDS}
      mutation addMember($roomInput: RoomInput) {
        addMember(roomInput: $roomInput) {
          ...CoreRoomFields
        }
      }
    `,
    variables: action.payload,
    fetchPolicy: "no-cache",
  };

  try {
    const res = yield call(client.mutate, options);

    yield put(newMember(res.data));
  } catch (error) {
    yield put(userErrorFetching(error));
  }
}

export default addMember;
