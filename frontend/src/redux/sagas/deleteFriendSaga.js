import { put, call } from "redux-saga/effects";
import { gql } from '@apollo/client';
import client from "../../client";
import { deleteContact } from "../reducers/userSlice";
import { setDefaultNotification } from "../reducers/notificationSlice";

function* deleteFriend(action) {
  const options = {
    mutation: gql`
    mutation DeleteFriend($friendInput: FriendInput) {
      deleteFriend(friendInput: $friendInput) {
        success
        errorMessage
        value {
          username
          friendsList {
            username
            email
            name
            avatar
          }
          avatar
          email
          name
          rooms {
            _id
            name
            groupalChat
            admin {
              username
            }
            members {
              username
              name
              email
              joinedAt
              avatar
            }
          }
          _id
          token
          requests {
            to {
              username
              name
              email
              avatar
            }
            from {
              username
              name
              email
              avatar
            }
          }
          settings {
            language
          }
        }
      }
    }
        `,
    variables: action.payload,
    fetchPolicy: "no-cache",
  };
  try {
    const res = yield call(client.mutate, options);
    const value = res.data.deleteFriend.value;

    yield put(deleteContact(value));
  } catch (error) {
    yield put(setDefaultNotification());
  }
};

export default deleteFriend;