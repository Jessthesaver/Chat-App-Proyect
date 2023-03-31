import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isFetching: false,
    error: null,
    currentConversation: null,
    value: [],
};

const conversationSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state = null, action) => {
            state.isFetching = false;
            state.value = [...state.value, action.payload]
        },
        currentConversation: (state = null, action) => {
            state.currentConversation = action.payload;
        },
        getRoomMessages: (state = null, action) => {
            state.value = action.payload;
        },
        conversationSetLogout: (state = null, action) => {
            state.isFetching = false;
            state.error = null;
            state.currentConversation = null;
            state.value = [];
        }
    },
});

export const { addMessage, currentConversation, getRoomMessages, conversationSetLogout } = conversationSlice.actions;

export default conversationSlice.reducer;