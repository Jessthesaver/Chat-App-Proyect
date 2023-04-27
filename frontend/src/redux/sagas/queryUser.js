import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import { setUser, userErrorFetching } from "../reducers/userSlice";

import client from "../../client.js";

function* queryUser() {
  const options = {
    query: gql`
      query {
        currentUser {
          _id
          username
          name
          avatar
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
            to {
              username
              name
              avatar
            }
          }
          rooms {
            _id
            name
            groupalChat
            admin {
              username
            }
            members {
              username
              avatar
              joinedAt
            }
          }
          token
        }
      }
    `,
    fetchPolicy: "no-cache",
  };
  try {
    const res = yield call(client.query, options);
    const { currentUser } = res.data;

    yield put(setUser({ user: currentUser }));
  } catch (err) {
    yield put(userErrorFetching({ err }));
  }
}

export default queryUser;
