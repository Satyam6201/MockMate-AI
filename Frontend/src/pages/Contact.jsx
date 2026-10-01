import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all form fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Your message has been sent successfully. Our team will get back to you shortly.');
    }, 600);
  };

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800'>
      <Navbar />

      <div className='flex-1 relative py-12 px-4 sm:px-6'>
        <div className='absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none'></div>
        <div className='absolute bottom-10 right-20 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none'></div>

        <div className='max-w-5xl mx-auto relative z-10'>
          <div className='text-center mb-12'>
            <span className='text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-2'>
              Support & Inquiries
            </span>
            <h1 className='text-3xl sm:text-5xl font-black text-slate-900 tracking-tight'>
              Get In Touch
            </h1>
            <p className='text-slate-500 max-w-xl mx-auto mt-3 text-xs sm:text-sm font-normal'>
              Have questions about ATS resume audits, interview simulations, or custom corporate tiers? Send us a message and our support engineers will respond.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
            <div className='lg:col-span-5 space-y-4'>
              <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4'>
                <h2 className='text-lg font-bold text-slate-900 border-b border-slate-100 pb-3'>
                  Contact Information
                </h2>

                <div className='flex items-start gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100'>
                  <div className='w-10 h-10 bg-emerald-100 text-emerald-800 flex items-center justify-center rounded-xl text-lg shrink-0 mt-0.5'>
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className='font-bold text-slate-900 text-sm'>Email Support</h3>
                    <p className='text-slate-600 text-xs mt-0.5'>support@mockmate.ai</p>
                    <p className='text-[11px] text-slate-400 mt-1'>Response turnaround within 24 hours</p>
                  </div>
                </div>

                <div className='flex items-start gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100'>
                  <div className='w-10 h-10 bg-teal-100 text-teal-800 flex items-center justify-center rounded-xl text-lg shrink-0 mt-0.5'>
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className='font-bold text-slate-900 text-sm'>Engineering Headquarters</h3>
                    <p className='text-slate-600 text-xs mt-0.5'>Bangalore & Silicon Valley</p>
                    <p className='text-[11px] text-slate-400 mt-1'>Global Remote Platform Support</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs'>
              <h2 className='text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5'>
                Send Us a Direct Message
              </h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 mb-1'>Full Name</label>
                    <input
                      type='text'
                      placeholder='Alex Rivera'
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className='w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 mb-1'>Email Address</label>
                    <input
                      type='email'
                      placeholder='alex@example.com'
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className='w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-semibold text-slate-700 mb-1'>Your Message</label>
                  <textarea
                    placeholder='How can we assist your interview or resume preparation?'
                    rows='5'
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className='w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 resize-none'
                    required
                  ></textarea>
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50'
                >
                  <FaPaperPlane className='text-xs' />
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;