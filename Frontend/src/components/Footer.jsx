import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsRobot, BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";
import { HiArrowRight, HiOutlineMail } from "react-icons/hi";
import { FiZap } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const STATS = [
  { value: "50K+", label: "Interviews Conducted" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "100+", label: "Curated SDE Topics" },
  { value: "4.9/5", label: "Average Candidate Rating" },
];

const LINKS = {
  Product: [
    { name: "Home", to: "/" },
    { name: "ATS Resume Builder", to: "/resume" },
    { name: "SDE Preparation", to: "/prepare" },
    { name: "Pricing & Credits", to: "/payment" },
    { name: "Interview History", to: "/history" },
  ],
  Resources: [
    { name: "Documentation", to: "/docs" },
    { name: "Contact Support", to: "/contact" },
    { name: "Blog & Guides", to: "/blog" },
    { name: "Help Center", to: "/help" },
  ],
  Legal: [
    { name: "Privacy Policy", to: "/privacy-policy" },
    { name: "Terms of Service", to: "#" },
    { name: "Security Standards", to: "#" },
  ],
};

const SOCIALS = [
  { icon: BsGithub, href: "https://github.com/Satyam6201/MockMate-AI", label: "GitHub" },
  { icon: BsLinkedin, href: "#", label: "LinkedIn" },
  { icon: BsTwitterX, href: "#", label: "X / Twitter" },
];

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 relative overflow-hidden font-sans">
      <div className="border-b border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                  {stat.value}
                </p>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          <div className="lg:col-span-4 space-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer w-fit"
              onClick={() => { navigate("/"); scrollToTop(); }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 text-lg">
                <BsRobot />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                MockMate <span className="text-emerald-600">AI</span>
              </span>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
              The intelligent AI mock interview and ATS resume engineering platform trusted by candidates to accelerate their tech careers.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
                <FiZap className="text-emerald-600" />
                AI Powered
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
                ATS Optimized
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 text-slate-600 transition shadow-2xs"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {Object.entries(LINKS).map(([group, items]) => (
              <div key={group} className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {group}
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.to}
                        onClick={scrollToTop}
                        className="text-slate-600 hover:text-emerald-700 transition flex items-center gap-1"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Stay Updated
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Receive interview tips, ATS resume optimization strategies, and engineering guides.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                {subscribed ? (
                  <span className="flex items-center gap-1.5 text-white">
                    <FaCheckCircle /> Subscribed!
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Subscribe <HiArrowRight size={13} />
                  </span>
                )}
              </button>
            </form>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              By subscribing, you agree to our{" "}
              <Link to="/privacy-policy" className="text-emerald-700 hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MockMate AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-800 transition">Privacy Policy</Link>
            <Link to="/docs" className="hover:text-slate-800 transition">Documentation</Link>
            <Link to="/contact" className="hover:text-slate-800 transition">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;