import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import {
  setDefaultNotification,
  setNotification,
} from "../reducers/notificationSlice";
import { setUser } from "../reducers/userSlice";
import { t } from "i18next";

function* setLanguage(action) {
  const options = {
    mutation: gql`
      mutation ChangeLanguage($settingsInput: SettingsInput) {
        changeLanguage(settingsInput: $settingsInput) {
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
                name
                avatar
                joinedAt
              }
            }
            token
          }
        }
      }
    `,
    variables: action.payload,
  };

  try {
    const res = yield call(client.mutate, options);

    const { changeLanguage } = res.data;
    const { value: user } = changeLanguage;

    yield put(
      setNotification({ severity: "success", error: t("languageChanged") })
    );
    yield put(setUser({ user }));
  } catch (err) {
    yield put(setDefaultNotification());
  }
}

export default setLanguage;
