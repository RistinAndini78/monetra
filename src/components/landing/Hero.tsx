import React from "react";
import { motion } from "framer-motion";

export const Hero: React.FC = () => {
  return (
    <section className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto">
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-5xl sm:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight"
      >
        Smart Way to <span className="text-brand">Master Your Money</span>
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium"
      >
        Pengalaman mengelola keuangan yang modern, otomatis, dan terperinci. 
        Pantau pengeluaran, tabungan, dan investasi Anda dalam satu dashboard yang indah.
      </motion.p>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 flex flex-wrap justify-center gap-4"
      >
        <button className="bg-brand text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-hover hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand/20">
          Mulai Kelola Keuangan
        </button>
        <button className="bg-white text-slate-900 border-2 border-slate-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-200 transition-all">
          Lihat Demo
        </button>
      </motion.div>
    </section>
  );
};
