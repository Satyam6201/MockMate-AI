import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import InterviewPage from "./pages/InterviewPage";
import InterviewHistory from "./pages/InterviewHistory";
import Pricing from "./pages/Pricing";
import InterviewReport from "./pages/InterviewReport";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Docs from "./pages/Docs";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Help from "./pages/HelpCenter";
import PaymentSuccess from "./pages/PaymentSuccess";
import { Toaster } from "react-hot-toast";

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
      </Routes>
    </>
  )
}

export default App