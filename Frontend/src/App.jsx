import { Route, Routes } from "react-router-dom"
import React, { Suspense, lazy, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import { Toaster } from "react-hot-toast";

// Lazy Loaded Pages (Code Splitting for performance)
const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const InterviewPage = lazy(() => import("./pages/InterviewPage"));
const InterviewHistory = lazy(() => import("./pages/InterviewHistory"));
const Pricing = lazy(() => import("./pages/Pricing"));
const InterviewReport = lazy(() => import("./pages/InterviewReport"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Docs = lazy(() => import("./pages/Docs"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const Help = lazy(() => import("./pages/HelpCenter"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Preparation = lazy(() => import("./pages/Preparation"));
const NotFound = lazy(() => import("./pages/NotFound"));
import Chatbot from "./components/Chatbot";

export const serverUrl = "http://localhost:8080";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/current-user", {
          withCredentials: true
        })
        dispatch(setUserData(result.data));

      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    }

    getUser();
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000, style: { borderRadius: '10px', background: '#333', color: '#fff' } }} />
      <Chatbot />
      <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
          </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/history" element ={<InterviewHistory />} />
          <Route path="/payment" element={<Pricing />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/report/:id" element={<InterviewReport />} />
          <Route path="/policy" element={<PrivacyPolicy />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/help" element={<Help />} /> 
          <Route path="/contact" element={<Contact />} /> 
          <Route path="/prepare" element={<Preparation />} /> 
          
          {/* Catch-all route for unmapped paths (404 Error Handling) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App