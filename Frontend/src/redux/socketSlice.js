import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "DISCONNECTED", // CONNECTED, CONNECTING, RECONNECTING, DISCONNECTED, ERROR
    interviewState: {}, // Stores real-time updates for active interview
    evaluationStatus: null, // Stores currently evaluating status
    resumeProcessing: null // Stores resume processing stage
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setConnectionStatus: (state, action) => {
            state.status = action.payload;
        },
        setInterviewState: (state, action) => {
            state.interviewState = { ...state.interviewState, ...action.payload };
        },
        setEvaluationStatus: (state, action) => {
            state.evaluationStatus = action.payload;
        },
        setResumeProcessing: (state, action) => {
            state.resumeProcessing = action.payload;
        }
    }
});

export const { 
    setConnectionStatus, 
    setInterviewState, 
    setEvaluationStatus, 
    setResumeProcessing 
} = socketSlice.actions;

export default socketSlice.reducer;
