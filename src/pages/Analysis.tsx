import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  BarChart3,
  PieChart as PieIcon,
  Download,
  Info,
  Sparkles
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "motion/react";

const Analysis: React.FC = () => {
  const cashFlowData = [
    { name: "Jan", income: 0, expenses: 0 },
    { name: "Feb", income: 0, expenses: 0 },
    { name: "Mar", income: 0, expenses: 0 },
    { name: "Apr", income: 0, expenses: 0 },
    { name: "Mei", income: 0, expenses: 0 },
    { name: "Jun", income: 0, expenses: 0 },
    { name: "Jul", income: 0, expenses: 0 },
  ];

  const categoryData = [
    { name: "Belum Ada Data", value: 1, color: "#F1F5F9" },
  ];

  const insights = [
    {
      title: "Data Belum Tersedia",
      description: "Lakukan transaksi pertama Anda untuk mulai melihat analisis lonjakan pengeluaran.",
      type: "info",
      icon: <Info size={20} className="text-slate-400" />,
      action: "Input Transaksi Baru"
    },
    {
      title: "Menunggu Input",
      description: "Monetra akan memberikan saran penghematan setelah mendeteksi pola belanja Anda.",
      type: "info",
      icon: <Sparkles size={20} className="text-slate-400" />,
      action: "Pelajari Caranya"
    },
    {
      title: "Skor Efisiensi",
      description: "Skor kesehatan finansial Anda saat ini adalah 0/100 karena belum ada aktivitas.",
      type: "info",
      icon: <BarChart3 size={20} className="text-slate-400" />,
      action: "Mulai Tracking"
    }
  ];

  const formatCurrencyShort = (value: number) => {
    return `Rp${value}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Analisis Keuangan</h2>
          <p className="text-slate-400 font-medium tracking-tight">Data analisis akan tampil secara otomatis setelah Anda menambahkan transaksi.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-1 flex items-center gap-2 shadow-sm">
             <button className="px-4 py-2 text-xs font-black bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/20">Bulanan</button>
             <button className="px-4 py-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors">Triwulanan</button>
             <button className="px-4 py-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors">Tahunan</button>
          </div>
          <button className="bg-white border border-slate-100 p-3 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
             <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Cash Flow Linear Chart */}
        <div className="xl:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Tren Arus Kas</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Menunggu Data Transaksi</p>
              </div>
           </div>
           
           <div className="h-[350px] w-full flex items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
              <div className="text-center">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                    <TrendingUp size={32} />
                 </div>
                 <p className="text-sm font-black text-slate-400">Belum ada grafik untuk ditampilkan</p>
              </div>
           </div>
        </div>

        {/* Expense Category Donut */}
        <div className="xl:col-span-4 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Kategori Pengeluaran</h3>
              <div className="h-[250px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={0}
                          dataKey="value"
                       >
                          {categoryData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</span>
                    <span className="text-2xl font-black text-slate-900">Rp 0</span>
                 </div>
              </div>
           </div>

           <div className="space-y-4 pt-10">
              <div className="text-center py-4">
                 <p className="text-xs font-bold text-slate-400 italic">Belum ada kategori terdeteksi</p>
              </div>
           </div>
        </div>
      </div>



      {/* Monthly Data Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mt-10">
         <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Riwayat Performa Keuangan</h3>
            <button disabled className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-not-allowed">
               <Download size={14} />
               Ekspor CSV
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50">
                     <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bulan</th>
                     <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Penghasilan</th>
                     <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengeluaran</th>
                     <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tabungan</th>
                     <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Efisiensi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {[
                     { month: "Mei 2026", gain: "Rp 0", loss: "Rp 0", net: "Rp 0", score: "0%" },
                     { month: "April 2026", gain: "Rp 0", loss: "Rp 0", net: "Rp 0", score: "0%" },
                     { month: "Maret 2026", gain: "Rp 0", loss: "Rp 0", net: "Rp 0", score: "0%" },
                  ].map((row, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors group cursor-default">
                        <td className="px-10 py-6 text-sm font-black text-slate-900">{row.month}</td>
                        <td className="px-10 py-6 text-sm font-bold text-slate-400">{row.gain}</td>
                        <td className="px-10 py-6 text-sm font-bold text-slate-400">{row.loss}</td>
                        <td className="px-10 py-6 text-sm font-black text-slate-400">{row.net}</td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 max-w-[80px] h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-slate-200 rounded-full" style={{ width: row.score }} />
                              </div>
                              <span className="text-[10px] font-black text-slate-300">{row.score}</span>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Analysis;
