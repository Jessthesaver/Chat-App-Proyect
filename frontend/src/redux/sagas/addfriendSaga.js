import { put, call } from "redux-saga/effects";
import { gql } from '@apollo/client';
import client from "../../client";
import { setNotification } from "../reducers/notificationSlice";


function* addFriend(action) {
    const options = {
        mutation: gql`
        mutation AddFriend($friendInput: FriendInput) {
            addFriend(friendInput: $friendInput) {
                from {
                    name
                    username
                    avatar
                  }
                  to{
                    name
                    username
                    avatar
                  }
            }
          }
        `,
        variables: action.payload,
        fetchPolicy: "no-cache",
    };
    try {
        yield call(client.mutate, options);

        yield put(setNotification({ error: "request Sent", severity: "success" }));
    } catch (error) {
        if (error.message === "Request already sent") {
            yield put(setNotification({ error: "add Friend Error", severity: "error" }));
        } else if (error.message === "User not found") {
            yield put(setNotification({ error: "user Not Found", severity: "error" }));
        } else {
            yield put(setNotification({ error: error.message, severity: "error" }));
        }
    }
};

export default addFriend;
