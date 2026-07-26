import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const blogData = [
  {
    id: 1,
    title: "How to Crack Technical Interviews",
    desc: "A comprehensive guide on behavioral and technical rounds at FAANG companies.",
    category: "Interview",
    author: "Satyam",
    date: "March 2026",
    readTime: "12 min read",
    tag: "DSA",
    featured: true,
    difficulty: "Advanced",
  },
  {
    id: 2,
    title: "Top 5 DSA Tips for Beginners",
    desc: "Start your DSA journey with focus on Arrays, Strings, and Big O notation.",
    category: "DSA",
    author: "Satyam",
    date: "Feb 2026",
    readTime: "8 min read",
    tag: "Beginner",
    difficulty: "Easy",
  },
  {
    id: 3,
    title: "Why Mock Interviews Matter",
    desc: "Simulating real-world pressure to identify your weak spots early.",
    category: "Interview",
    author: "Satyam",
    date: "Jan 2026",
    readTime: "6 min read",
    tag: "Career",
    difficulty: "Medium",
  },
  {
    id: 4,
    title: "React Performance Optimization",
    desc: "Using useMemo, useCallback, and code splitting for lightning-fast apps.",
    category: "Development",
    author: "Satyam",
    date: "Jan 2026",
    readTime: "10 min read",
    tag: "React",
    difficulty: "Advanced",
  },
  {
    id: 5,
    title: "Mastering System Design",
    desc: "Understanding Scalability, Load Balancers, and Caching mechanisms.",
    category: "Development",
    author: "Satyam",
    date: "Dec 2025",
    readTime: "15 min read",
    tag: "Backend",
    difficulty: "Hard",
  },
  {
    id: 6,
    title: "The Art of Clean Code",
    desc: "Writing readable, maintainable, and testable code in any language.",
    category: "Development",
    author: "Satyam",
    date: "Nov 2025",
    readTime: "5 min read",
    tag: "Principles",
    difficulty: "Medium",
  },
];

const categories = ["All", "DSA", "Interview", "Development"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

const Blog = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBlogs = blogData.filter((blog) => {
    return (
      (activeCategory === "All" || blog.category === activeCategory) &&
      (blog.title.toLowerCase().includes(search.toLowerCase()) || 
       blog.tag.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const featuredPost = blogData.find((b) => b.featured);

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-gray-900 px-4 py-16">
      <button onClick={() => navigate("/")}
        className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
        <FaArrowLeft className='text-gray-600'/>
      </button>
      <div className="max-w-6xl mx-auto">
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-500">
            Insights & Engineering
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Deep dives into software architecture, algorithmic mastery, and career growth.
          </p>
        </motion.header>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by topic or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activeCategory === cat
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-black"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeCategory === "All" && !search && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative overflow-hidden bg-black rounded-3xl p-8 md:p-12 mb-16 text-white cursor-pointer"
            >
              <div className="relative z-10 md:w-2/3">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                  Featured Article
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-gray-300 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  {featuredPost.desc}
                </p>
                <div className="flex items-center gap-4">
                    <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                        Start Reading
                    </button>
                    <span className="text-sm text-gray-500 font-mono">{featuredPost.readTime}</span>
                </div>
              </div>
              <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-gradient-to-br from-gray-800 to-transparent rounded-full opacity-50 blur-3xl pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                variants={cardVariants}
                layout
                whileHover={{ y: -8 }}
                className="group flex flex-col bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase py-1 px-2 bg-gray-100 rounded-md">
                    {blog.tag}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                    blog.difficulty === 'Advanced' ? 'text-red-500 bg-red-50' : 
                    blog.difficulty === 'Medium' ? 'text-orange-500 bg-orange-50' : 'text-green-500 bg-green-50'
                  }`}>
                    {blog.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-3">
                  {blog.desc}
                </p>

                <div className="border-t pt-4 mt-auto">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">{blog.author}</span>
                      <span>{blog.date}</span>
                    </div>
                    <span className="font-mono">{blog.readTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredBlogs.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold">No results found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {setSearch(""); setActiveCategory("All")}}
              className="mt-4 text-sm font-bold underline"
            >
                Reset all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;