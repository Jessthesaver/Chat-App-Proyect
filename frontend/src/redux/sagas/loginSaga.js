import { put, call } from "redux-saga/effects";
import { gql } from "@apollo/client";
import client from "../../client";
import { setUser } from "../reducers/userSlice";
import { setNotification } from "../reducers/notificationSlice";
import { t } from "i18next";
//import { USER_FIELDS } from "../../graphql/userFragmentGql";

function* login(action) {
  const options = {
    mutation: gql`
      mutation Login($userInput: UserInput) {
        login(userInput: $userInput) {
          token
          _id
          email
          avatar
          friendsList {
            avatar
            email
            joinedAt
            name
            username
          }
          name
          rooms {
            _id
            admin {
              joinedAt
              avatar
              email
              name
              username
            }
            groupalChat
            isDeleted
            members {
              email
              avatar
              joinedAt
              name
              username
            }
            name
          }
          requests {
            from {
              avatar
              email
              joinedAt
              name
              username
            }
            to {
              avatar
              email
              joinedAt
              name
              username
            }
          }
          settings {
            language
          }
          username
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
