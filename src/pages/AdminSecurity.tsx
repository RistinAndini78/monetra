import React from "react";
import { 
  Shield, 
  Lock, 
  AlertOctagon, 
  Globe, 
  Terminal, 
  Key, 
  Zap,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const data = [
  { name: "SQLi", value: 12, color: "#f43f5e" },
  { name: "DDoS", value: 45, color: "#7C3AED" },
  { name: "Brute", value: 28, color: "#f59e0b" },
  { name: "XSS", value: 8, color: "#10b981" },
];

const AdminSecurity: React.FC = () => {
  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin / </span>
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Audit Keamanan</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Keamanan Sistem</h2>
          <p className="text-slate-400 font-medium mt-1">Deteksi ancaman waktu nyata dan pengawasan penguatan infrastruktur.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-900/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Firewall Aktif</span>
           </div>
        </div>
      </header>

      {/* Kartu Skor Keamanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
               <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10">Skor Kesehatan Keamanan</h4>
               <div className="flex items-center justify-center py-10 scale-110">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-emerald-500" strokeDasharray={552} strokeDashoffset={552 - (552 * 0.94)} />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-slate-900">94</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sangat Baik</span>
                     </div>
                  </div>
               </div>
            </div>
            <div className="relative z-10 pt-10 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
               <span className="text-emerald-500">+2 poin dari minggu lalu</span>
               <button className="text-violet-600 hover:underline">Lihat Riwayat</button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
         </div>

         {/* Grafik Analisis Ancaman */}
         <div className="lg:col-span-8 bg-slate-900 p-10 rounded-[40px] text-white">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-black tracking-tight">Vektor Ancaman</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Upaya diblokir berdasarkan jenis (24 jam terakhir)</p>
               </div>
               <div className="p-3 bg-white/5 rounded-2xl">
                  <AlertOctagon size={24} className="text-rose-400" />
               </div>
            </div>
            
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 900, fill: 'rgba(255,255,255,0.3)' }}
                       dy={10}
                     />
                     <YAxis hide />
                     <Tooltip 
                       cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                       contentStyle={{ 
                         backgroundColor: '#1e293b',
                         borderRadius: '16px', 
                         border: 'none', 
                         boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)',
                         padding: '12px 16px'
                       }} 
                     />
                     <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Insiden Aktif & Peta Globe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-7 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Log Kontrol Akses</h3>
                  <button className="text-xs font-black text-violet-600 uppercase tracking-widest hover:underline">Lihat Semua</button>
               </div>
               
               <div className="space-y-4">
                  {[
                    { event: "Login Admin Berhasil", user: "admin_morgan_x", ip: "192.168.1.1", time: "2 menit lalu", status: "success" },
                    { event: "Kunci API Dibuat", user: "dev_system_01", ip: "node_internal", time: "14 menit lalu", status: "success" },
                    { event: "Upaya SSH Gagal", user: "root", ip: "203.11.44.201", time: "1 jam lalu", status: "fail" },
                    { event: "Aturan WAF Terpicu", user: "tidak_dikenal", ip: "45.22.109.12", time: "2 jam lalu", status: "fail" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group border border-transparent hover:border-slate-100 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl ${log.status === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                             {log.status === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900">{log.event}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{log.user} • {log.ip}</p>
                          </div>
                       </div>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{log.time}</span>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="mt-10 p-6 bg-slate-900 rounded-[32px] flex items-center justify-between text-white">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white">
                     <Terminal size={18} />
                  </div>
                  <div>
                     <p className="text-xs font-black">Shell Interaktif</p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hubungkan ke node utama</p>
                  </div>
               </div>
               <button className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Luncurkan</button>
            </div>
         </div>

         <div className="lg:col-span-5 bg-[#F8F9FA] p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 opacity-10 flex items-center justify-center grayscale pointer-events-none">
               <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" alt="Map" className="w-full object-contain" />
            </div>
            
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-2">
                  <Globe className="text-violet-600" size={18} />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Lalu Lintas Geografis</h3>
               </div>
               <p className="text-slate-400 text-xs font-medium leading-relaxed">Permintaan autentikasi paling aktif berdasarkan wilayah.</p>
            </div>
            
            <div className="relative z-10 mt-10 space-y-6 flex-1 flex flex-col justify-center">
               {[
                 { label: "Amerika Utara", value: 65, color: "bg-violet-600" },
                 { label: "Uni Eropa", value: 42, color: "bg-sky-400" },
                 { label: "Asia Pasifik", value: 24, color: "bg-slate-900" },
               ].map(region => (
                 <div key={region.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-900">{region.label}</span>
                       <span className="text-slate-400">{region.value}% permintaan</span>
                    </div>
                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-sm">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: `${region.value}%` }}
                         className={`h-full ${region.color} rounded-full`}
                       />
                    </div>
                 </div>
               ))}
            </div>
            
            <button className="relative z-10 w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm border border-slate-100 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all mt-8">
               Lihat Peta Lalu Lintas Lengkap
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminSecurity;
