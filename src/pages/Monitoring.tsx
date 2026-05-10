import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Cpu, 
  Database, 
  Server, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  Shield,
  FileText
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

const mockTpsData = Array.from({ length: 20 }, (_, i) => ({
  time: `${14 + Math.floor(i/4)}:${(i%4)*15}`,
  tps: 400 + Math.random() * 200,
}));

const logs = [
  { id: "1", timestamp: "14:24:02.341", event: "Transaksi Ditandatangani", source: "192.168.1.104", status: "BERHASIL", type: "tx" },
  { id: "2", timestamp: "14:23:59.892", event: "Permintaan Autentikasi", source: "45.22.109.12", status: "BERHASIL", type: "auth" },
  { id: "3", timestamp: "14:23:55.120", event: "Penarikan Gagal", source: "203.11.44.201", status: "DIBLOKIR", type: "fail" },
  { id: "4", timestamp: "14:23:51.004", event: "Alokasi Bucket", source: "SYSTEM_CORE", status: "TERTUNDA", type: "system" },
];

const Monitoring: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.2em]">Pemantauan Langsung</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Kesehatan Sistem</h2>
          <p className="text-slate-400 font-medium mt-1">Aliran data WebSocket waktu nyata dari klaster infrastruktur inti.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-all ${
              isLive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
            }`}
          >
            <RefreshCw size={14} className={isLive ? 'animate-spin-slow' : ''} />
            {isLive ? 'Aktif' : 'Jeda'}
          </button>
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
             {["Metrik", "Log", "Keamanan"].map((tab) => (
               <button 
                 key={tab}
                 className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${tab === 'Metrik' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-slate-400 hover:text-slate-900'}`}
               >
                 {tab}
               </button>
             ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Statistik Inti */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Pengguna Aktif Langsung</h3>
            <div className="p-3 bg-violet-600/5 text-violet-600 rounded-2xl">
               <Users size={20} />
            </div>
          </div>
          
          <div>
            <div className="flex items-baseline gap-4 mb-4">
               <p className="text-5xl font-black text-violet-600 tracking-tighter">12.842</p>
               <div className="flex items-center text-emerald-500 font-bold text-xs">
                  <ArrowUpRight size={14} />
                  <span>14%</span>
               </div>
            </div>
            <div className="flex gap-1 h-12 items-end">
               {[40, 70, 45, 90, 60, 100].map((h, i) => (
                 <motion.div 
                   key={i}
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   className="flex-1 bg-violet-600 rounded-t-lg opacity-40"
                   style={{ opacity: 0.2 + (i * 0.15) }}
                 />
               ))}
            </div>
          </div>
        </div>

        {/* Grafik Throughput */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl">
                 <Activity size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Transaksi Per Detik (TPS)</h3>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Live</button>
               <button className="px-4 py-1.5 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100">1 JAM</button>
            </div>
          </div>
          
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTpsData}>
                <defs>
                  <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px'
                  }} 
                />
                <Area type="monotone" dataKey="tps" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorTps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Cpu size={20} />, label: "Penggunaan CPU", value: "42%", color: "text-violet-600", ring: "border-violet-600" },
          { icon: <Database size={20} />, label: "Beban Memori", value: "8.4GB / 16GB", color: "text-sky-500", ring: "border-sky-500" },
          { icon: <Clock size={20} />, label: "Rata-rata Latensi", value: "14ms", color: "text-slate-900", ring: "border-slate-900" },
        ].map((metric, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group">
            <div>
               <div className="flex items-center gap-2 text-slate-300 group-hover:text-slate-500 transition-colors mb-2">
                 {metric.icon}
                 <span className="text-[10px] font-black uppercase tracking-widest">{metric.label}</span>
               </div>
               <p className={`text-2xl font-black ${metric.color}`}>{metric.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-full border-4 ${metric.ring} border-opacity-10 flex items-center justify-center relative`}>
               <div className={`absolute inset-0 rounded-full border-t-4 ${metric.ring} animate-spin-slow`} />
               <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Log Aktivitas */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                <FileText size={20} />
             </div>
             <h3 className="text-xl font-black text-slate-900">Log Aktivitas Langsung</h3>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memperbarui otomatis...</span>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                {["Cap Waktu", "Kejadian", "IP Sumber", "Status", "Tindakan"].map(head => (
                  <th key={head} className="pb-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 text-xs font-mono font-bold text-slate-400">{log.timestamp}</td>
                  <td className="py-6">
                    <p className="text-sm font-black text-slate-900">{log.event}</p>
                  </td>
                  <td className="py-6 text-xs font-mono text-slate-400">{log.source}</td>
                  <td className="py-6">
                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      log.status === 'BERHASIL' ? 'bg-emerald-50 text-emerald-500' : 
                      log.status === 'DIBLOKIR' ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-6">
                    <button className="p-2 text-slate-300 hover:text-violet-600 transition-colors">
                       <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kartu Footer Status Server */}
      <div className="bg-slate-900 p-10 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-8">
            <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center text-emerald-400">
               <Shield size={32} />
            </div>
            <div>
               <h4 className="text-2xl font-black tracking-tight mb-1">Penjaga Lalu Lintas Global</h4>
               <p className="text-slate-400 text-sm font-medium">Perlindungan DDoS internal dan firewall edge aktif di 14 wilayah.</p>
            </div>
         </div>
         <div className="relative z-10 flex gap-4">
            <button className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-white/20 transition-all uppercase tracking-widest">Riwayat Insiden</button>
            <button className="bg-violet-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-violet-600/20 hover:scale-105 transition-all uppercase tracking-widest">Peta Jaringan</button>
         </div>
         
         <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};

export default Monitoring;
