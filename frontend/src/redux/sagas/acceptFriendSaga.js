import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { acceptFriend, userErrorFetching } from "../reducers/userSlice";

function* acceptContact(action) {
  const options = {
    mutation: gql`
    mutation AcceptFriend($friendInput: FriendInput) {
      acceptFriend(friendInput: $friendInput) {
        success
        errorMessage
        value {
          username
          name
          email
          settings {
            language
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
          avatar
          friendsList {
            username
            avatar
            name
            email
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
              name
              avatar
              joinedAt
            }
          }
        }
      }
    }
        `,
    variables: action.payload,
    fetchPolicy: "network-only"
  }
  try {
    const res = yield call(client.mutate, options);
    const { value } = res.data.acceptFriend;

    yield put(acceptFriend(value));
  } catch (error) {
    yield put(userErrorFetching(error));
  }
};

export default acceptContact;