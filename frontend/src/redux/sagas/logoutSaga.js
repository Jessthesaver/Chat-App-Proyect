import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { userSetLogout } from "../reducers/userSlice";


function* logout(action) {
    const options = {
        mutation: gql`
        mutation Logout($cookieInput: CookieInput) {
            logout(cookieInput: $cookieInput) {
              success
              errorMessage
              value {
                username
              }
            }
          }
        `,
        variables: action.payload
    };

    client.clearStore();
    yield call(client.mutate, options);

    yield put(userSetLogout());

};

export default logout;