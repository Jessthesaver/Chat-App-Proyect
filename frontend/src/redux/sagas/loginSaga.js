import { put, call } from "redux-saga/effects";
import { gql } from "@apollo/client";
import client from "../../client";
import { setUser } from "../reducers/userSlice";
import { setNotification } from "../reducers/notificationSlice";
import { t } from "i18next";

function* login(action) {
  const options = {
    mutation: gql`
      mutation Login($userInput: UserInput) {
        login(userInput: $userInput) {
          username
          name
          email
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
          settings {
            language
          }
          token
        }
      }
    `,
    variables: {
      userInput: action.payload.user,
    },
  };
  try {
    const res = yield call(client.mutate, options);
    const user = res.data.login;

    yield put(setUser({ user }));
  } catch (error) {
    const notification = {
      error: error.message,
      severity: "error",
    };

    if (notification.error === "User not Found") {
      notification.error = t("userNotFound");
    } else if (notification.error === "The user or password is incorrect") {
      notification.error = t("userPasswordIncorrect");
    } else if (notification.error === "Missing credentials") {
      notification.error = t("missingCredentials");
    }

    yield put(setNotification(notification));
  }
}

export default login;
