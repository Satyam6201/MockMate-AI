import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaDownload, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { jsPDF } from "jspdf";
import { autoTable } from 'jspdf-autotable'
import toast from 'react-hot-toast';

const Step3Report = ({report}) => {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 p-6'>
        <div className="flex flex-col items-center text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className='text-gray-700 text-lg font-semibold mb-2'>Generating Detailed Report...</p>
           <p className='text-gray-500 text-sm mb-6'>If this takes too long, you can check your past interview history.</p>
           <button 
             onClick={() => navigate('/history')}
             className='px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all text-sm'>
             View Interview History
           </button>
        </div>
      </div>
    )
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = []
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index+1}`,
    score: score.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence, color: "bg-blue-500" },
    { label: "Communication", value: communication, color: "bg-purple-500" },
    { label: "Correctness", value: correctness, color: "bg-emerald-500" }
  ];

  let performanceText = "";
  let shortTagline = "";
  let badgeColor = "";

  if (finalScore >= 8) {
    performanceText = "Outstanding! Ready for opportunities."
    shortTagline = "Excellent clarity and structured response."
    badgeColor = "text-green-600 bg-green-100 border-green-200"
  }
  else if (finalScore >= 5) {
    performanceText = "Good Effort. Needs minor refinement."
    shortTagline = "Solid foundation, practice your delivery."
    badgeColor = "text-yellow-600 bg-yellow-100 border-yellow-200"
  }
  else {
    performanceText = "Needs Practice. Keep going!"
    shortTagline = "Work on clarity, structure, and confidence."
    badgeColor = "text-red-600 bg-red-100 border-red-200"
  }

  const score = finalScore;
  const percentage = (score / 10) * 100; 

  const downloadPDF = () => {
    const doc = new jsPDF("P", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    // Title 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, { align: "center" });

    currentY += 5;

    // underline
    doc.setDrawColor(34, 194, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    // final score box
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore} / 10 - ${performanceText}`, pageWidth / 2, currentY + 12, { align: "center" });

    currentY += 30;

    // skills box
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    currentY += 45;

    let advice = "";
    if (finalScore >= 8) {
      advice = "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice = "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice = "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly."
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    // Question table
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback
      ]),
      styles: { fontSize: 9, cellPadding: 5, valign: "top" },
      headStyles: { fillColor: [34, 197, 94], textColor: 255, halign: "center" },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: "auto" }
      }, 
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    doc.save("AI_Interview_Report.pdf");
    toast.success("PDF Downloaded Successfully!");
  };

  const shareReport = async () => {
    const shareText = `I just scored a ${finalScore}/10 on my AI Mock Interview at MockMate AI! \n\nPerformance: ${performanceText}\n\nCan you beat my score? Try it out!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My MockMate AI Score',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('[Step3Report] Share failed:', err);
        }
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText + " " + window.location.href);
        toast.success("Score copied to clipboard! Share it anywhere.");
      } catch (err) {
        console.error('[Step3Report] Clipboard copy failed:', err);
        toast.error("Could not copy to clipboard. Please copy link manually.");
      }
    } else {
      toast.error("Sharing is not supported on this browser.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className='min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-12 py-10 font-sans pb-20'>
      
      {/* Header */}
      <div className='mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 max-w-7xl mx-auto'>
        <div className='flex items-center gap-4'>
          <button 
            onClick={() => navigate("/history")}
            className='p-4 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-gray-50 border border-gray-100 transition-all'>
              <FaArrowLeft className='text-gray-600'/>
          </button>
          <div>
            <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900'>
              Interview Analytics
            </h1>
            <p className='text-gray-500 mt-1 font-medium'>
              Comprehensive AI-powered performance insights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareReport}
            className="flex items-center gap-2 bg-white text-gray-700 hover:text-green-600 border border-gray-200 py-3 px-6 rounded-full shadow-sm font-bold transition-colors">
            <FaShareAlt /> Share Score
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white py-3 px-8 rounded-full shadow-lg font-bold transition-colors">
            <FaDownload /> Download PDF
          </motion.button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>

        {/* Column 1: Overall Score & Skills */}
        <div className='space-y-8'>
          
          <motion.div variants={itemVariants} className='bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden'>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
            <h2 className='text-gray-500 font-bold uppercase tracking-wider mb-8 text-sm'>Overall Performance</h2>
            
            <div className='relative w-32 h-32 sm:w-40 sm:h-40 mx-auto drop-shadow-md'>
              <CircularProgressbar 
                value={percentage} 
                text={`${score}/10`} 
                styles={buildStyles({
                  textSize: "22px",
                  pathColor: score >= 8 ? "#10b981" : score >= 5 ? "#eab308" : "#ef4444",
                  textColor: "#111827",
                  trailColor: "#f3f4f6",
                  pathTransitionDuration: 1.5,
                })}
              />
            </div>
            
            <div className='mt-8'>
              <span className={`inline-block border px-4 py-1.5 rounded-full text-sm font-bold mb-3 ${badgeColor}`}>
                {performanceText}
              </span>
              <p className='text-gray-500 text-sm font-medium'>{shortTagline}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className='bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8'>
            <h3 className='text-lg font-bold text-gray-900 mb-6 flex items-center justify-between'>
              Skill Evaluation
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-semibold">Out of 10</span>
            </h3>
            <div className='space-y-6'>
              {skills.map((s, i) => (
                <div key={i}>
                  <div className='flex justify-between mb-2 text-sm font-bold text-gray-700'>
                    <span>{s.label}</span>
                    <span className='text-gray-900'>{s.value}</span>
                  </div>
                  <div className='bg-gray-100 h-3 rounded-full overflow-hidden'>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value * 10}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`${s.color} h-full rounded-full shadow-inner`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Column 2 & 3: Trends & Question Breakdown */}
        <div className='lg:col-span-2 space-y-8'>
          
          <motion.div variants={itemVariants} className='bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8'>
            <div className="flex justify-between items-center mb-8">
               <h3 className='text-xl font-bold text-gray-900'>Score Consistency</h3>
               <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">Trend Analysis</span>
            </div>

            <div className='h-72 w-full'>
              <ResponsiveContainer width="100%" height="100%" >
                <AreaChart data={questionScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold', color: '#10b981' }}
                  />
                  <Area 
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorScore)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className='bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8'>
            <h3 className='text-xl font-bold text-gray-900 mb-8'>Detailed Breakdown</h3>

            <div className='space-y-6'>
              {questionWiseScore.map((q, i) => (
                <div key={i} className='group bg-gray-50 hover:bg-white p-6 rounded-2xl border border-gray-100 hover:border-green-200 transition-all hover:shadow-md'>
                  
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded uppercase'>Q {i + 1}</span>
                      </div>
                      <p className='font-bold text-gray-800 text-lg leading-relaxed'>
                        {q.question || "Question not available"}
                      </p>
                    </div>

                    <div className='shrink-0 flex items-center justify-center bg-white border border-gray-200 w-16 h-16 rounded-2xl shadow-sm group-hover:border-green-200 transition-colors'>
                      <div className="text-center">
                        <span className="block text-lg font-black text-green-600 leading-none">{q.score ?? 0}</span>
                        <span className="block text-[10px] font-bold text-gray-400 mt-1 uppercase">Score</span>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white border-l-4 border-green-500 p-4 rounded-r-xl shadow-sm'>
                    <div className='flex items-center gap-2 mb-2'>
                       <FaCheckCircle className='text-green-500' />
                       <p className='text-xs text-gray-500 font-bold uppercase tracking-wide'>AI Feedback</p>
                    </div>
                    <p className='text-sm text-gray-700 leading-relaxed font-medium'>
                      {q.feedback && q.feedback.trim() !== "" ? q.feedback : "No feedback available for this question"}
                    </p>
                  </div>
                  
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}

export default Step3Report