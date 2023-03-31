import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification } from "../reducers/notificationSlice";
import { rejectFriend } from "../reducers/userSlice";

function* rejectContact(action) {
  const options = {
    mutation: gql`
        mutation rejectFriend($friendInput: FriendInput) {
            rejectFriend(friendInput: $friendInput) {
              success
              errorMessage
              value {
                username
                name
                email
                avatar
                settings {
                  language
                }
                friendsList {
                  username
                  name
                  email
                  avatar
                }
                requests {
                  from {
                    username
                    name
                    avatar
                  }
                  to{
                    username
                    name
                    avatar
                  }
                }
                rooms {
                  _id
                  name
                  admin {
                    username
                  }
                  groupalChat
                  members {
                    username
                    joinedAt
                  }
                }
              }
            }
          }
        `,
    variables: action.payload
  };

  try {
    const res = yield call(client.mutate, options);

    const user = res.data.rejectFriend?.value;

    yield put(rejectFriend(user));

  } catch (error) {
    yield put(setDefaultNotification());

  }
};

export default rejectContact;