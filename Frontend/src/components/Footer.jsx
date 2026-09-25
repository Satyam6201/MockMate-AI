import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsRobot, BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";
import { HiArrowRight, HiOutlineMail } from "react-icons/hi";
import { HiArrowUpRight } from "react-icons/hi2";
import { motion, AnimatePresence } from "motion/react";
import { FiZap } from "react-icons/fi";

const STATS = [
  { value: "50K+", label: "Interviews Conducted" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "120+", label: "Interview Topics" },
  { value: "4.9★", label: "Average Rating" },
];

const LINKS = {
  Product: [
    { name: "Home", to: "/" },
    { name: "Preparation", to: "/prepare" },
    { name: "Pricing", to: "/payment" },
    { name: "Documentation", to: "/docs" },
    { name: "Contact Us", to: "/contact" },
  ],
  Resources: [
    { name: "Interview Tips", to: "/docs" },
    { name: "Help Center", to: "/help" },
    { name: "Blog", to: "/blog" },
    { name: "Changelog", to: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", to: "/policy" },
    { name: "Terms of Service", to: "#" },
    { name: "Cookie Policy", to: "#" },
    { name: "Security", to: "#" },
  ],
};

const SOCIALS = [
  { icon: BsGithub, href: "#", label: "GitHub", color: "hover:text-white hover:bg-gray-700" },
  { icon: BsLinkedin, href: "#", label: "LinkedIn", color: "hover:text-white hover:bg-blue-600" },
  { icon: BsTwitterX, href: "#", label: "X / Twitter", color: "hover:text-white hover:bg-black" },
];

const NavLink = ({ to, children, onClick }) => (
  <li>
    <Link
      to={to}
      onClick={onClick}
      className="group inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
    >
      <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-200 text-green-400">
        <HiArrowRight size={12} />
      </span>
      {children}
    </Link>
  </li>
);

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 800);
  };

  return (
    <footer className="bg-gray-950 text-white relative overflow-hidden">

      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <div
              className="flex items-center gap-3 cursor-pointer w-fit group"
              onClick={() => { navigate("/"); scrollToTop(); }}
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-all duration-300">
                <BsRobot size={22} />
              </div>
              <span className="text-xl font-black tracking-tight">
                MockMate <span className="text-green-400">AI</span>
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The AI-powered interview platform trusted by thousands of professionals. Practice smarter, land faster.
            </p>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold px-3 py-1.5 rounded-full">
                <FiZap size={11} className="fill-green-400" />
                AI Powered
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 text-gray-400 border border-white/10 text-xs font-bold px-3 py-1.5 rounded-full">
                🔒 SOC 2 Compliant
              </span>
            </div>

            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all duration-200 ${color}`}
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-8">
            {Object.entries(LINKS).map(([group, items], gi) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + gi * 0.07 }}
              >
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-5">
                  {group}
                </h4>
                <ul className="space-y-3.5">
                  {items.map((item) => (
                    <NavLink key={item.name} to={item.to} onClick={scrollToTop}>
                      {item.name}
                    </NavLink>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-5">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Interview tips, AI updates & career advice — directly in your inbox. No spam, ever.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-green-500/20 transition-all duration-200"
                >
                  <AnimatePresence mode="wait">
                    {status === "loading" ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Subscribing…
                      </motion.span>
                    ) : status === "success" ? (
                      <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        🎉 Subscribed!
                      </motion.span>
                    ) : (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        Subscribe <HiArrowRight size={14} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>

            <p className="text-gray-600 text-xs mt-3 leading-relaxed">
              By subscribing you agree to our{" "}
              <Link to="/policy" className="text-gray-500 hover:text-white underline underline-offset-2 transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-500 font-semibold">MockMate AI</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link
                key={item}
                to="#"
                className="text-gray-600 hover:text-gray-300 text-xs font-medium transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Back to top"
            className="flex items-center gap-2 text-gray-500 hover:text-white text-xs font-semibold border border-white/10 hover:border-white/20 px-4 py-2 rounded-full transition-all"
          >
            Back to top <HiArrowUpRight size={13} />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;