import React from "react";
import { TrendingUp, Target } from "lucide-react";
import { motion } from "motion/react";

export const SavingsGoal: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-50 rounded-xl">
              <Target className="text-cyan-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Target Tabungan</h3>
              <p className="text-slate-500 text-xs font-medium">Liburan ke Jepang 🇯🇵</p>
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <TrendingUp className="text-slate-400 w-5 h-5" />
          </div>
        </div>
        
        <div className="mt-8 space-y-5">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Terkumpul</p>
              <p className="text-xl font-black text-slate-900">Rp 15.000.000</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-cyan-600">60%</p>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 relative"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[slide_2s_linear_infinite]" />
            </motion.div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-50">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                  {i}
                </div>
              ))}
            </div>
            <button className="text-xs bg-slate-900 text-white font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
              Tambah Saldo
            </button>
          </div>
        </div>
      </div>

      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50/50 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl -ml-12 -mb-12" />
    </div>
  );
};
