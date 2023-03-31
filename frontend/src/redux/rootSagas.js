import { all, takeEvery, takeLatest } from "redux-saga/effects";

import login from "./sagas/loginSaga.js";
import queryUser from "./sagas/queryUser.js";
import signup from "./sagas/signupSaga.js";
import logout from "./sagas/logoutSaga.js";
import acceptContact from "./sagas/acceptFriendSaga.js";
import addFriend from "./sagas/addfriendSaga.js";
import checkEmail from "./sagas/checkEmailSaga.js";
import checkUsername from "./sagas/checkUsernameSaga.js";
import deleteFriend from "./sagas/deleteFriendSaga.js";
import requestFriendAccepted from "./sagas/friendRequestAcceptedSaga.js";
import rejectContact from "./sagas/rejectFriendSaga.js";
import removeNotification from "./sagas/removeNotificationSaga.js";
import addNewRequest from "./sagas/addRequestSaga.js";
import deletedFrom from "./sagas/deleteFromSaga.js";
import newMessage from "./sagas/newMessageSaga.js";
import addNewMessage from "./sagas/addNewMessageSaga.js";
import setConversation from "./sagas/setConversationSaga.js";
import queryMessages from "./sagas/queryMessageSaga.js";
import createGroup from "./sagas/createGroupSaga.js";
import deleteMember from "./sagas/deleteMemberSaga.js";
import addMember from "./sagas/addMemberSaga.js";
import addAdmin from "./sagas/addAdminSaga.js";
import deleteAdmin from "./sagas/deleteAdminSaga.js";
import leaveGroup from "./sagas/leaveGroupSaga.js";
import deleteGroup from "./sagas/deleteGroupSaga.js";
import newScribble from "./sagas/newScribbleSaga.js";
import groupChanges from "./sagas/groupChangesSaga.js";
import setLanguage from "./sagas/setLanguage.js";

export function* watchLogin() {
  yield takeLatest("login", login);
}

export function* watchQueryUser() {
  yield takeLatest("authUser", queryUser);
}

export function* watchSignup() {
  yield takeLatest("signup", signup);
}

export function* watchLogout() {
  yield takeLatest("logout", logout);
}

export function* watchAddContact() {
  yield takeEvery("addFriend", addFriend);
}

export function* watchDeleteContact() {
  yield takeEvery("deleteFriend", deleteFriend);
}

export function* watchAcceptFriend() {
  yield takeEvery("acceptContact", acceptContact);
}

export function* watchRejectFriend() {
  yield takeEvery("rejectFriend", rejectContact);
}

export function* watchAddNewRequest() {
  yield takeEvery("addNewRequest", addNewRequest);
}

export function* watchCleanNotification() {
  yield takeLatest("cleanNotification", removeNotification);
}

export function* watchUsernameExistence() {
  yield takeLatest("usernameExistence", checkUsername);
}

export function* watchEmailExistence() {
  yield takeLatest("emailExistence", checkEmail);
}

export function* watchRequestFriendAccepted() {
  yield takeEvery("requestAccepted", requestFriendAccepted);
}

export function* watchDeletedFromContact() {
  yield takeEvery("deletedFromContact", deletedFrom);
}

export function* watchCreateMessage() {
  yield takeEvery("createMessage", newMessage);
}

export function* watchCreateScribble() {
  yield takeEvery("createScribble", newScribble);
}

export function* watchAddMessage() {
  yield takeLatest("addNewMessage", addNewMessage);
}
export function* watchCurrentConv() {
  yield takeLatest("setConversation", setConversation);
}

export function* watchQueryMessages() {
  yield takeLatest("queryMessages", queryMessages);
}

export function* watchCreateGroup() {
  yield takeEvery("createGroup", createGroup);
}

export function* watchDeleteMembers() {
  yield takeEvery("deleteMember", deleteMember);
}

export function* watchAddMembers() {
  yield takeEvery("addMember", addMember);
}

export function* watchAddAdmin() {
  yield takeEvery("addAdmin", addAdmin);
}

export function* watchDeleteAdmin() {
  yield takeEvery("deleteAdmin", deleteAdmin);
}

export function* watchLeaveGroup() {
  yield takeEvery("leaveGroup", leaveGroup);
}

export function* watchDeleteGroup() {
  yield takeEvery("deleteGroup", deleteGroup);
}

export function* watchGroupChanges() {
  yield takeEvery("groupChanges", groupChanges);
}

export function* watchSetLanguage() {
  yield takeEvery("setLanguage", setLanguage);
}

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchQueryUser(),
    watchSignup(),
    watchLogout(),
    watchAddContact(),
    watchDeleteContact(),
    watchAcceptFriend(),
    watchRejectFriend(),
    watchAddNewRequest(),
    watchCleanNotification(),
    watchUsernameExistence(),
    watchEmailExistence(),
    watchRequestFriendAccepted(),
    watchDeletedFromContact(),
    watchCreateMessage(),
    watchCreateScribble(),
    watchAddMessage(),
    watchCurrentConv(),
    watchQueryMessages(),
    watchCreateGroup(),
    watchDeleteMembers(),
    watchAddMembers(),
    watchAddAdmin(),
    watchDeleteAdmin(),
    watchLeaveGroup(),
    watchDeleteGroup(),
    watchGroupChanges(),
    watchSetLanguage(),
  ]);
}
