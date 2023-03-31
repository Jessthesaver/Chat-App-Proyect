import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification, setExistence } from "../reducers/notificationSlice";


function* checkUsername(action) {

    const options = {
        query: gql`
        query($username: String) {
            existence(username: $username) {
                username
            }
        }
        `,
        variables: action.payload,
        fetchPolicy: "no-cache",
    }
    try {
        const { data: { existence } } = yield call(client.query, options);

        yield put(setExistence(existence));
    } catch (error) {
        yield put(setDefaultNotification());
    }
};

export default checkUsername;