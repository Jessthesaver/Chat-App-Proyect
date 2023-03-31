import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        language: "en"
    },
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        changeLanguage: (state, action) => {
            state.value = action.payload;
        },
        // errorChangeLanguage: (state, action) => {
        //     state.value = action.payload;
        // }
    },
});

export const { changeLanguage, errorChangeLanguage } = settingsSlice.actions;


export default settingsSlice.reducer;