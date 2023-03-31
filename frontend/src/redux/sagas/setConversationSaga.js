import { put } from "redux-saga/effects";
import { currentConversation } from "../reducers/conversationSlice";

function* setConversation(action) {
    yield put(currentConversation(action.payload));
};

export default setConversation;