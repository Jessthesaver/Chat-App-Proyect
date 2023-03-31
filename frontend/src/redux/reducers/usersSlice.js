import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isFetching: false,
    error: null,
    value: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state = null, action) => {
            state.isFetching = false;
            state.value = action.payload.users;
        },
        setUsersFetching: (state = null) => {
            state.isFetching = true;
        },
        usersErrorFetching: (state = null, action) => {
            state.isFetching = false;
            state.error = action.payload.message
        },
        usersSetLogout: (state = null, action) => {
            state.isFetching = false;
            state.error = null;
            state.value = null;
        }
    },
});

export const { setUsers, setUsersFetching, usersErrorFetching, usersSetLogout } = usersSlice.actions;

export default usersSlice.reducer;