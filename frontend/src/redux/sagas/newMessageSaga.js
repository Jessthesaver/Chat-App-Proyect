import { gql } from "@apollo/client";
import { t } from "i18next";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setNotification } from "../reducers/notificationSlice";

function* newMessage(action) {
  const options = {
    mutation: gql`
      mutation createMessage($messageInput: MessageInput) {
        createMessage(messageInput: $messageInput) {
          _id
          chatId
          #sendBy
          content
          isScribble
        }
      }
    `,
    variables: {
      messageInput: action.payload,
    },
    fetchPolicy: "no-cache",
  };
  try {
    yield call(client.mutate, options);
  } catch (err) {
    yield put(
      setNotification({ error: t("errorSendMessage"), severity: "warning" })
    );
  }
}

export default newMessage;
