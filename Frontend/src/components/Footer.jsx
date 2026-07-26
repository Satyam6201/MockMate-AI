import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsRobot, BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";

const Footer = () => {
  const navigate = useNavigate();

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

  return (
    <footer className="bg-[#f3f3f3] px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">

          <div>
            <div className="flex justify-center md:justify-start items-center gap-3 mb-3">
              <div className="bg-black text-white p-2 rounded-lg">
                <BsRobot size={18} />
              </div>
              <h2 className="font-semibold text-lg">MockMate AI</h2>
            </div>
            <p className="text-gray-500 text-sm">
              AI-powered interview preparation platform to boost your confidence,
              communication skills, and technical knowledge.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="text-gray-500 text-sm space-y-2">
              <li>
                <Link to="/" onClick={scrollToTop} className="hover:text-black">
                  Home
                </Link>
              </li>
              <li>
                <button onClick={() => handleScroll("features")} className="hover:text-black">
                  Features
                </button>
              </li>
              <li>
                <Link to="/payment" onClick={scrollToTop} className="hover:text-black">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollToTop} className="hover:text-black">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="text-gray-500 text-sm space-y-2">
              <li>
                <Link to="/blog" onClick={scrollToTop} className="hover:text-black">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/docs" onClick={scrollToTop} className="hover:text-black">
                  Docs
                </Link>
              </li>
              <li>
                <Link to="/help" onClick={scrollToTop} className="hover:text-black">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/policy" onClick={scrollToTop} className="hover:text-black">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="flex justify-center md:justify-start gap-4 text-gray-600">
              <a href="#" target="_blank" rel="noreferrer">
                <BsGithub size={20} className="hover:text-black cursor-pointer" />
              </a>
              <a href="#" target="_blank" rel="noreferrer">
                <BsLinkedin size={20} className="hover:text-blue-600 cursor-pointer" />
              </a>
              <a href="#" target="_blank" rel="noreferrer">
                <BsTwitter size={20} className="hover:text-sky-500 cursor-pointer" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-200 mt-8 pt-5 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MockMate AI. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;