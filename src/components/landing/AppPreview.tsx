import React from "react";
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  PieChart 
} from "lucide-react";
import { motion } from "motion/react";

export const AppPreview: React.FC = () => {
  return (
    <section className="px-6 py-20 bg-white">
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-6xl mx-auto bg-slate-50 rounded-[40px] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex h-[500px]"
      >
        {/* Mock Sidebar */}
        <div className="w-64 bg-white/50 backdrop-blur-md border-r border-slate-100 p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-6 h-6 bg-violet-600 rounded-md" />
             <span className="text-sm font-black text-violet-600 tracking-tighter">Monetra</span>
          </div>
          
          {[
            { icon: LayoutDashboard, label: "Beranda", id: "Dashboard", active: true },
            { icon: Wallet, label: "Dompet", id: "Wallet" },
            { icon: PieChart, label: "Analisis", id: "Analysis" },
          ].map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" : "text-slate-400 font-bold text-sm"}`}
            >
              <item.icon size={18} />
              <span className="text-sm font-bold">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Mock Main Content */}
        <div className="flex-1 p-10 bg-white/30 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Halo, Alex!</h3>
              <p className="text-slate-400 text-sm font-medium">Ini ringkasan keuanganmu bulan ini.</p>
            </div>
            <div className="w-32 h-10 bg-violet-600/10 rounded-xl" />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { label: "TOTAL SALDO", value: "Rp 45.250.000", color: "text-violet-600" },
              { label: "PENGELUARAN", value: "Rp 8.120.000", color: "text-rose-500" },
              { label: "TABUNGAN", value: "Rp 12.000.000", color: "text-emerald-500" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Abstract Chart */}
          <div className="bg-[#0f172a] h-48 rounded-3xl p-8 flex items-end gap-3 justify-around overflow-hidden relative">
             {[0.4, 0.7, 0.5, 0.9, 0.6, 1].map((h, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${h * 100}%` }}
                 transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                 className="w-full max-w-[40px] bg-violet-600/80 rounded-t-lg relative group"
               >
                 <div className="absolute inset-0 bg-gradient-to-t from-violet-600/50 to-transparent rounded-t-lg" />
               </motion.div>
             ))}
             {/* Diagonal line decorative */}
             <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full">
                  <path d="M0,150 L200,80 L400,120 L600,20 L800,100" fill="none" stroke="white" strokeWidth="2" />
                </svg>
             </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
