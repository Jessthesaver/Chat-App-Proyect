
import { put } from "redux-saga/effects";
import { addMessage } from "../reducers/conversationSlice";

function* addNewMessage(action) {
    yield put(addMessage(action.payload));
};

export default addNewMessage;