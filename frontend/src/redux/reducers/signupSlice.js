import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isFetching: false,
    error: null,
    value: null,
};

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        setSignupFetching: (state = null) => {
            state.isFetching = true;
        },
    },
});

export const { setSignupFetching } = signupSlice.actions;

export default signupSlice.reducer;