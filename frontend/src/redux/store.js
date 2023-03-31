import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSagas";
import authReducer from "./reducers/loginSlice";
import signupReducer from "./reducers/signupSlice";
import userReducer from "./reducers/userSlice";
import notificationReducer from "./reducers/notificationSlice";
import conversationReducer from "./reducers/conversationSlice";
import settingsReducer from "./reducers/settingsSlice.js";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const store = configureStore({
  reducer: {
    login: authReducer,
    user: userReducer,
    signup: signupReducer,
    messages: conversationReducer,
    settings: settingsReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = [
      ...getDefaultMiddleware({ thunk: false }),
      ...middlewares,
    ];

    return middleware;
  },
});

sagaMiddleware.run(rootSaga);

export default store;
