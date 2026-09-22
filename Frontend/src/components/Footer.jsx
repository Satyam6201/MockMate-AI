import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsRobot, BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";
import { HiArrowRight, HiOutlineMail } from "react-icons/hi";
import { motion } from "motion/react";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleScroll = (id) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.1,
        when: "beforeChildren"
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-gray-50 px-4 sm:px-6 py-12 relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10 sm:p-12 relative z-10"
      >

        {/* Newsletter Section - New Feature */}
        <motion.div variants={itemVariants} className="mb-12 pb-12 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
           <div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to our Newsletter</h3>
             <p className="text-gray-500">Get the latest interview tips, AI updates, and career advice directly to your inbox.</p>
           </div>
           
           <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center relative">
             <div className="relative w-full md:w-80">
               <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
               <input 
                 type="email" 
                 required
                 placeholder="Enter your email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full pl-12 pr-32 py-4 bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm"
               />
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 type="submit" 
                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-black transition-colors"
               >
                 {subscribed ? "Subscribed!" : "Subscribe"}
               </motion.button>
             </div>
           </form>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="flex justify-center md:justify-start items-center gap-3 mb-4 cursor-pointer" onClick={scrollToTop}>
              <div className="bg-gradient-to-br from-gray-900 to-black text-white p-2.5 rounded-xl shadow-md">
                <BsRobot size={20} />
              </div>
              <h2 className="font-bold text-xl tracking-tight text-gray-900">
                MockMate <span className="text-green-600">AI</span>
              </h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              AI-powered interview preparation platform designed to boost your confidence, refine your communication skills, and test your technical knowledge.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <motion.a whileHover={{ y: -5, color: '#111827' }} href="#" target="_blank" rel="noreferrer" className="text-gray-400 bg-gray-50 p-3 rounded-full hover:bg-gray-100 transition-colors">
                <BsGithub size={20} />
              </motion.a>
              <motion.a whileHover={{ y: -5, color: '#2563EB' }} href="#" target="_blank" rel="noreferrer" className="text-gray-400 bg-gray-50 p-3 rounded-full hover:bg-gray-100 transition-colors">
                <BsLinkedin size={20} />
              </motion.a>
              <motion.a whileHover={{ y: -5, color: '#0EA5E9' }} href="#" target="_blank" rel="noreferrer" className="text-gray-400 bg-gray-50 p-3 rounded-full hover:bg-gray-100 transition-colors">
                <BsTwitter size={20} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Product</h3>
            <ul className="text-gray-500 text-sm space-y-3 font-medium">
              {[
                { name: "Home", link: "/", action: scrollToTop },
                { name: "Features", action: () => handleScroll("features") },
                { name: "Pricing", link: "/payment", action: scrollToTop },
                { name: "Contact Us", link: "/contact", action: scrollToTop },
              ].map((item, idx) => (
                <li key={idx}>
                  {item.link ? (
                    <Link to={item.link} onClick={item.action} className="group flex items-center justify-center md:justify-start gap-2 hover:text-green-600 transition-colors">
                      <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-green-500"><HiArrowRight size={14}/></span>
                      {item.name}
                    </Link>
                  ) : (
                    <button onClick={item.action} className="group flex items-center justify-center md:justify-start gap-2 hover:text-green-600 transition-colors mx-auto md:mx-0">
                      <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-green-500"><HiArrowRight size={14}/></span>
                      {item.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Resources</h3>
            <ul className="text-gray-500 text-sm space-y-3 font-medium">
              {[
                { name: "Blog", link: "/blog" },
                { name: "Documentation", link: "/docs" },
                { name: "Help Center", link: "/help" },
                { name: "API Reference", link: "#" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link to={item.link} onClick={scrollToTop} className="group flex items-center justify-center md:justify-start gap-2 hover:text-green-600 transition-colors">
                      <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-green-500"><HiArrowRight size={14}/></span>
                      {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="text-gray-500 text-sm space-y-3 font-medium">
              {[
                { name: "Privacy Policy", link: "/policy" },
                { name: "Terms of Service", link: "#" },
                { name: "Cookie Policy", link: "#" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link to={item.link} onClick={scrollToTop} className="group flex items-center justify-center md:justify-start gap-2 hover:text-green-600 transition-colors">
                      <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-green-500"><HiArrowRight size={14}/></span>
                      {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        <motion.div variants={itemVariants} className="border-t border-gray-100 mt-12 pt-6 text-center text-sm text-gray-400 font-medium flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} MockMate AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Cookies</span>
          </div>
        </motion.div>

      </motion.div>
    </footer>
  );
};

export default Footer;