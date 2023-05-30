import { put, call } from "redux-saga/effects";
import { gql } from "@apollo/client";
import client from "../../client";
import { setSignupFetching } from "../reducers/signupSlice";
import { setNotification } from "../reducers/notificationSlice";
import { t } from "i18next";

function* signup(action) {
  const options = {
    mutation: gql`
      mutation CreateUser($userInput: UserInput) {
        createUser(userInput: $userInput) {
          success
          errorMessage
          value {
            username
            name
            email
          }
        }
      }
    `,
    variables: {
      userInput: action.payload.signup,
    },
  };

  try {
    yield put(setSignupFetching());
    yield call(client.mutate, options);

    yield put(
      setNotification({
        error: t("userCreated"),
        severity: "success",
      })
    );
  } catch (error) {
    console.log(error.message);
    if (error.message === "The username has been taken") {
      error.message = t("usernameExistsError");
    } else if (error.message === "The email has been used") {
      error.message = t("emailExistsError");
    }

    yield put(setNotification({ error: error.message, severity: "error" }));
  }
}

export default signup;
