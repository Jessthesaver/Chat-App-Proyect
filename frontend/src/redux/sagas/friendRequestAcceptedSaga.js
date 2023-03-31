import { put } from "redux-saga/effects";
import { setUser } from "../reducers/userSlice";
import { setNotification } from "../reducers/notificationSlice";

function* watchRequestFriendAccepted(action) {
    const user = action.payload;

    yield put(setUser({ user }));
    yield put(setNotification({ error: 'friend Request Accepted', severity: "success" }));
};

export default watchRequestFriendAccepted;