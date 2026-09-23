import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js"
import socketReducer from "./socketSlice.js";

export default configureStore({
    reducer: {
        user: userSlice,
        socket: socketReducer
    },
})