import { gql } from "@apollo/client";
import { call, put } from "redux-saga/effects";
import client from "../../client";
import { newAdmin, userErrorFetching } from '../reducers/userSlice';


function* addAdmin(action) {
    const options = {
        mutation: gql`
            mutation addAdmin($roomInput: RoomInput) {
             addAdmin(roomInput: $roomInput) {
                _id
                name
                groupalChat
                admin {
                    username
                }
                members {
                    username
                }
                }
            }
        `,
        variables: action.payload,
    }

    try {
        const res = yield call(client.mutate, options);

        yield put(newAdmin(res.data));
    } catch (error) {
        yield put(userErrorFetching(error));
    }
};

export default addAdmin;