import { motion } from "motion/react";
import { useState } from "react";
import { FaEnvelope, FaUser, FaCommentDots, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Message sent successfully");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <button onClick={() => navigate("/")}
        className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
        <FaArrowLeft className='text-gray-600'/>
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden"
      >
        {/* Left Section */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Contact MockMate AI
          </h2>
          <p className="text-gray-600 mb-6">
            Have questions, feedback, or need help? Reach out to us and we’ll get back to you soon.
          </p>

          <div className="space-y-4 text-gray-700">
            <p>Email: support@mockmate.ai</p>
            <p>Location: India</p>
            <p>Response Time: Within 24 hours</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FaUser className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-4 left-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div className="relative">
              <FaCommentDots className="absolute top-4 left-4 text-gray-400" />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold shadow-md transition"
            >
              Send Message
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact