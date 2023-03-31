import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { removeAdmin } from '../reducers/userSlice';


function* deleteAdmin(action) {
  const options = {
    mutation: gql`
        mutation deleteAdmin($roomInput: RoomInput) {
            deleteAdmin(roomInput: $roomInput) {
              _id
              name
              groupalChat
              admin {
                username
              }
              members {
                username
                name
                avatar
                joinedAt
              }
            }
          }
        `,
    variables: action.payload,
  }

  try {
    const res = yield call(client.mutate, options);

    yield put(removeAdmin(res.data));
  } catch (error) {
    yield put(setDefaultNotification());
  }
};

export default deleteAdmin;