import { gql } from "@apollo/client";
import { t } from "i18next";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { getRoomMessages } from "../reducers/conversationSlice";
import { setNotification } from "../reducers/notificationSlice";

function* queryMessages(action) {
  const options = {
    query: gql`
      query queryMessages($_id: String) {
        messages(_id: $_id) {
          _id
          content
          isScribble
          chatId
          sendBy
          createdAt
        }
      }
    `,
    variables: action.payload,

    fetchPolicy: "no-cache",
  };

  try {
    const res = yield call(client.query, options);
    const { messages } = res.data;

    yield put(getRoomMessages(messages));
  } catch (err) {
    yield put(
      setNotification({ error: t("errorQueryMessages"), severity: "warning" })
    );
  }
}

export default queryMessages;
