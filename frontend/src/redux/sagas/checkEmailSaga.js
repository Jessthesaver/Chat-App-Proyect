import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { setDefaultNotification, setExistence } from "../reducers/notificationSlice";


function* checkEmail(action) {

    const options = {
        query: gql`
        query($email: String) {
            existence(email: $email) {
                email
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

export default checkEmail;