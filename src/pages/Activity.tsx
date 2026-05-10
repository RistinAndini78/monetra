import React from "react";
import { 
  History, 
  LogIn, 
  PlusCircle, 
  ShieldCheck, 
  Settings, 
  Download,
  AlertCircle,
  Clock,
  Search
} from "lucide-react";
import { motion } from "motion/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const Activity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: "login",
      title: "Login Berhasil",
      description: "Masuk melalui Perangkat Desktop (Windows) - Jakarta, ID",
      time: new Date(),
      icon: <LogIn size={18} />,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      id: 2,
      type: "transaction",
      title: "Data Dinolkan",
      description: "Anda melakukan reset tampilan data dummy ke kondisi awal.",
      time: new Date(Date.now() - 3600000),
      icon: <PlusCircle size={18} />,
      color: "bg-slate-50 text-slate-600"
    },
    {
      id: 3,
      type: "security",
      title: "Verifikasi Keamanan",
      description: "Sesi Anda telah diverifikasi secara otomatis oleh sistem.",
      time: new Date(Date.now() - 86400000),
      icon: <ShieldCheck size={18} />,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      id: 4,
      type: "settings",
      title: "Pembaruan Profil",
      description: "Nama tampilan diubah menjadi Ristin Iman Andini.",
      time: new Date(Date.now() - 172800000),
      icon: <Settings size={18} />,
      color: "bg-amber-50 text-amber-600"
    }
  ];

  return (
    <div className="p-10 space-y-10 max-w-[1000px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <History size={20} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Riwayat Aktivitas</h2>
          </div>
          <p className="text-slate-400 font-medium">Pantau setiap jejak aktivitas dan keamanan akun Monetra Anda.</p>
        </div>
        
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
              type="text" 
              placeholder="Cari aktivitas..." 
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 w-full md:w-64 shadow-sm"
           />
        </div>
      </header>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
         {/* Vertical Line */}
         <div className="absolute left-[47px] top-12 bottom-12 w-px bg-slate-100" />
         
         <div className="p-8 md:p-12 space-y-12 relative z-10">
            {activities.map((act, i) => (
              <motion.div 
                key={act.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-8 group"
              >
                 {/* Icon Node */}
                 <div className={`w-12 h-12 ${act.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-4 border-white relative z-20 group-hover:scale-110 transition-transform`}>
                    {act.icon}
                 </div>
                 
                 {/* Content */}
                 <div className="flex-1 space-y-1 pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                       <h4 className="text-lg font-black text-slate-900 tracking-tight">{act.title}</h4>
                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full w-fit">
                          <Clock size={12} />
                          {format(act.time, "dd MMM yyyy, HH:mm", { locale: id })}
                       </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                       {act.description}
                    </p>
                 </div>
              </motion.div>
            ))}
         </div>
         
         <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-all flex items-center gap-2">
               Tampilkan Lebih Banyak <Download size={14} />
            </button>
         </div>
      </div>

      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex gap-6 items-start">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <AlertCircle size={24} />
         </div>
         <div className="space-y-1">
            <h5 className="font-black text-amber-900 tracking-tight">Butuh Bantuan Keamanan?</h5>
            <p className="text-sm text-amber-700 font-medium leading-relaxed">
               Jika Anda melihat aktivitas mencurigakan yang tidak Anda kenali, segera ubah kata sandi dan hubungi tim dukungan kami melalui menu profil.
            </p>
         </div>
      </div>
    </div>
  );
};

export default Activity;
