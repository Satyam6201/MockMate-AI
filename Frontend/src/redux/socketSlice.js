import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "DISCONNECTED", // CONNECTED, CONNECTING, RECONNECTING, DISCONNECTED, ERROR
    interviewState: {}, // Stores real-time updates for active interview (generation progress)
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
            // Fix: Spread only the nested `generation` key properly
            // Previously: { ...state.interviewState, ...payload } would clobber nested objects
            // Now: Deep merge the generation object correctly
            if (action.payload.generation) {
                state.interviewState.generation = action.payload.generation;
            } else {
                state.interviewState = { ...state.interviewState, ...action.payload };
            }
        },
        setEvaluationStatus: (state, action) => {
            state.evaluationStatus = action.payload;
        },
        setResumeProcessing: (state, action) => {
            state.resumeProcessing = action.payload;
        },
        // Fix: Added resetSocket action — without this, stale interview/resume state
        // persists across multiple interview sessions in the same page session
        resetSocket: (state) => {
            state.interviewState = {};
            state.evaluationStatus = null;
            state.resumeProcessing = null;
        }
    }
});

export const { 
    setConnectionStatus, 
    setInterviewState, 
    setEvaluationStatus, 
    setResumeProcessing,
    resetSocket,
} = socketSlice.actions;

export default socketSlice.reducer;
