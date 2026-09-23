import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setConnectionStatus, setEvaluationStatus, setInterviewState, setResumeProcessing } from "../redux/socketSlice";
import { setUserData } from "../redux/userSlice";
import toast from "react-hot-toast";

const SERVER_URL = "http://localhost:8080";

let socketInstance = null;

export const getSocket = () => socketInstance;

export const useSocket = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.userData);
    const status = useSelector(state => state.socket.status);

    useEffect(() => {
        // Only connect if user is authenticated
        if (user && !socketInstance) {
            dispatch(setConnectionStatus("CONNECTING"));
            
            socketInstance = io(SERVER_URL, {
                withCredentials: true,
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
            });

            socketInstance.on("connect", () => {
                dispatch(setConnectionStatus("CONNECTED"));
                console.log("WebSocket connected");
            });

            socketInstance.on("disconnect", (reason) => {
                dispatch(setConnectionStatus("DISCONNECTED"));
                console.log("WebSocket disconnected:", reason);
                if (reason === "io server disconnect") {
                    // disconnected by server, need to manually reconnect
                    socketInstance.connect();
                }
            });

            socketInstance.on("connect_error", (error) => {
                dispatch(setConnectionStatus("ERROR"));
                console.error("WebSocket connection error:", error);
            });

            // Global Notification Event
            socketInstance.on("notification", (data) => {
                if (data.type === "success") {
                    toast.success(data.message || data.title);
                } else if (data.type === "error") {
                    toast.error(data.message || data.title);
                } else {
                    toast(data.message || data.title);
                }
            });

            // Global User Updates
            socketInstance.on("user:credits_updated", (data) => {
                dispatch(setUserData({
                    ...user,
                    credits: user.credits + data.creditsAdded
                }));
            });
            
            // Resume processing
            socketInstance.on("resume:stage", (data) => {
                dispatch(setResumeProcessing(data));
            });
            
            socketInstance.on("resume:completed", (data) => {
                dispatch(setResumeProcessing({ stage: "COMPLETED", progress: 100, message: "Ready" }));
            });
            
            // Interview Generation
            socketInstance.on("interview:generation_progress", (data) => {
                 dispatch(setInterviewState({ generation: data }));
            });

            // Evaluation status
            socketInstance.on("evaluation:started", (data) => {
                dispatch(setEvaluationStatus({ status: "started", message: data.message }));
            });
            
            socketInstance.on("evaluation:processing", (data) => {
                dispatch(setEvaluationStatus({ status: "processing", message: data.message }));
            });
            
            socketInstance.on("evaluation:completed", (data) => {
                dispatch(setEvaluationStatus({ status: "completed", result: data }));
            });
        }

        return () => {
            if (socketInstance && !user) {
                socketInstance.disconnect();
                socketInstance = null;
                dispatch(setConnectionStatus("DISCONNECTED"));
            }
        };
    }, [user, dispatch]);

    const joinInterviewRoom = (interviewId) => {
        if (socketInstance && socketInstance.connected) {
            socketInstance.emit("join_interview", { interviewId });
        }
    };

    return {
        socket: socketInstance,
        status,
        joinInterviewRoom
    };
};
