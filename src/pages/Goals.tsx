import React from "react";
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Palmtree, 
  Home, 
  Car, 
  Gift,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Calendar
} from "lucide-react";
import { motion } from "motion/react";

const Goals: React.FC = () => {
  const goals = [
    {
      id: 1,
      name: "Liburan Mewah",
      target: 150000000,
      saved: 123000000,
      deadline: "Des 2024",
      icon: <Palmtree size={24} />,
      color: "bg-violet-50 text-violet-600",
      accent: "#7C3AED"
    },
    {
      id: 2,
      name: "DP Rumah",
      target: 2000000000,
      saved: 900000000,
      deadline: "Juli 2026",
      icon: <Home size={24} />,
      color: "bg-emerald-50 text-emerald-600",
      accent: "#10B981"
    },
    {
      id: 3,
      name: "Mobil Listrik Baru",
      target: 450000000,
      saved: 120000000,
      deadline: "Maret 2025",
      icon: <Car size={24} />,
      color: "bg-purple-50 text-purple-600",
      accent: "#8B5CF6"
    },
    {
      id: 4,
      name: "Dana Pernikahan",
      target: 150000000,
      saved: 145000000,
      deadline: "Okt 2024",
      icon: <Gift size={24} />,
      color: "bg-rose-50 text-rose-500",
      accent: "#F43F5E"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Target Tabungan</h2>
          <p className="text-slate-400 font-medium">Ubah impian Anda menjadi kenyataan dengan tabungan terstruktur.</p>
        </div>
        <button className="bg-violet-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-violet-700 active:scale-95 transition-all shadow-xl shadow-violet-600/20">
          <Plus size={20} />
          <span>Tambah Target Baru</span>
        </button>
      </header>

      {/* Hero Goal / Featured */}
      <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 group">
         <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md mb-8">
               <Sparkles size={16} className="text-violet-400" />
               <span className="text-xs font-black uppercase tracking-widest text-violet-400">Jalur Optimasi AI</span>
            </div>
            <h3 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">Anda hampir sampai <br /> di <span className="text-violet-400">Dana Pernikahan</span></h3>
            <p className="text-slate-400 font-medium text-lg max-w-xl mb-10 leading-relaxed">
               Anda hanya butuh <span className="text-white font-black">{formatCurrency(5000000)}</span> lagi untuk mencapai target Anda. Dengan laju saat ini, Anda akan mencapainya 2 minggu lebih awal dari rencana!
            </p>
            <div className="flex gap-4">
               <button className="bg-violet-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-violet-600/20">
                  Tingkatkan Tabungan
               </button>
               <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-sm hover:bg-white/20 transition-all">
                  Lihat Timeline
               </button>
            </div>
         </div>
         
         <div className="relative z-10 w-full lg:w-96 flex flex-col items-center">
            <div className="w-64 h-64 relative">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="128" cy="128" r="110" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="24" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 691 }}
                    animate={{ strokeDashoffset: 691 * (1 - 0.96) }}
                    transition={{ duration: 2, delay: 0.5 }}
                    cx="128" 
                    cy="128" 
                    r="110" 
                    fill="none" 
                    stroke="#7C3AED" 
                    strokeWidth="24" 
                    strokeDasharray="691" 
                    strokeLinecap="round" 
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black">96%</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Tercapai</span>
               </div>
            </div>
         </div>
         
         {/* Background pattern */}
         <div className="absolute top-0 right-0 w-full h-full bg-violet-600/5 blur-3xl rounded-full" />
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {goals.map((goal, i) => (
          <motion.div 
            key={goal.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all h-[400px]"
          >
            <div>
              <div className="flex justify-between items-start mb-10">
                <div className={`w-16 h-16 ${goal.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  {goal.icon}
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Target</p>
                   <div className="flex items-center gap-2 justify-end">
                      <Calendar size={12} className="text-slate-300" />
                      <span className="text-xs font-black text-slate-900">{goal.deadline}</span>
                   </div>
                </div>
              </div>
              
              <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{goal.name}</h4>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-8">
                {formatCurrency(goal.saved)} <span className="text-slate-200">/</span> {formatCurrency(goal.target)}
              </p>

              <div className="space-y-4">
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(goal.saved / goal.target) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: goal.accent }}
                   />
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                     {Math.round((goal.saved / goal.target) * 100)}% Tercapai
                   </span>
                   <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                      <ArrowUpRight size={10} />
                      Sesuai rencana
                   </div>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
               <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Tambah Kontribusi</span>
               <ChevronRight size={18} className="text-slate-400" />
            </button>
          </motion.div>
        ))}
        
        {/* Placeholder for adding new */}
        <div className="border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-violet-600/30 hover:bg-violet-600/5 transition-all h-[400px]">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Plus size={32} className="text-slate-300 group-hover:text-violet-600" />
           </div>
           <h4 className="text-xl font-black text-slate-300 group-hover:text-violet-600 transition-colors">Mulai Target Baru</h4>
           <p className="text-xs font-bold text-slate-200 mt-2 uppercase tracking-widest">Menabung untuk sesuatu yang besar?</p>
        </div>
      </div>
    </div>
  );
};

export default Goals;
