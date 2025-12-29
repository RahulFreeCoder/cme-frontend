import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./events/eventsSlice";
import usersReducer from "./users/usersSlice";
import authReducer from './auth/authSlice';
import cmeRegistrationReducer from './events/cmeRegistrationSlice'; 
import organizerReducer from './organizer/OrganizerSlice';
import { setupInterceptors } from "../services/axiosInterceptors";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    events: eventsReducer,
    auth: authReducer,
    cmeRegistration: cmeRegistrationReducer,
    organizer: organizerReducer,
  },
  devTools: {
    actionSanitizer: (action) =>
      action.type === "auth/login/pending"
        ? {
            ...action,
            meta: {
              ...action.meta,
              arg: { email: action.meta.arg.email, password: "***" },
            },
          }
        : action,
  },
});

setupInterceptors(store);