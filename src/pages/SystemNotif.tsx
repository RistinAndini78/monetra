import React, { useState } from "react";
import { 
  Bell, 
  Send, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Trash2,
  BellRing,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

const SystemNotif: React.FC = () => {
  const [notifs, setNotifs] = useState([
    { id: "1", type: "info", title: "Pembaruan Sistem v2.4", message: "Sistem Monetra baru saja diperbarui untuk meningkatkan stabilitas.", date: "Tadi" },
    { id: "2", type: "warning", title: "Maintenance Terjadwal", message: "Server akan mengalami pemeliharaan pada pukul 02:00 WIB.", date: "1 jam lalu" },
  ]);

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BellRing className="text-violet-600" size={16} />
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.3em]">Broadcast Center</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Notifikasi Sistem</h2>
          <p className="text-slate-400 font-medium mt-1">Kirim pengumuman global dan kelola peringatan sistem.</p>
        </div>
        
        <button className="bg-violet-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-violet-600/20 hover:scale-105 transition-all flex items-center gap-2 uppercase tracking-widest">
           <Send size={18} />
           <span>Kirim Pengumuman</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           {notifs.map((n) => (
             <motion.div 
               key={n.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex gap-6 group hover:shadow-md transition-all"
             >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  n.type === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                }`}>
                   {n.type === 'warning' ? <AlertTriangle size={24} /> : <Info size={24} />}
                </div>
                <div className="flex-1">
                   <div className="flex items-center justify-between mb-1">
                      <h4 className="font-black text-slate-900">{n.title}</h4>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{n.date}</span>
                   </div>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed">{n.message}</p>
                </div>
                <button className="self-center p-2 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                   <Trash2 size={20} />
                </button>
             </motion.div>
           ))}
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[32px] text-white overflow-hidden relative">
              <div className="relative z-10">
                 <h4 className="text-lg font-black mb-6 flex items-center gap-2">
                    <Globe size={18} className="text-violet-400" />
                    Target Audiens
                 </h4>
                 <div className="space-y-4">
                    {["Semua Pengguna", "Hanya User Gratis", "Hanya Administrator"].map(target => (
                      <div key={target} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-violet-500/50 transition-all cursor-pointer">
                         <span className="text-xs font-bold text-slate-300">{target}</span>
                         <CheckCircle size={16} className="text-violet-500" />
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 blur-3xl rounded-full" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SystemNotif;
