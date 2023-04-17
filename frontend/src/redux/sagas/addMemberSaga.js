import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { userErrorFetching, newMember } from "../reducers/userSlice";
import { ROOM_FIELDS } from "../../graphql/groupFragmentGql";

function* addMember(action) {
  const options = {
    mutation: gql`
      ${ROOM_FIELDS}
      mutation addMember($roomInput: RoomInput) {
        addMember(roomInput: $roomInput) {
          ...RoomFields
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
