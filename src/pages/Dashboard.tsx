import React, { useState, useEffect } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  Activity,
  ShieldCheck,
  TrendingUp,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, Tooltip, 
} from "recharts";

interface DashboardProps {
  onViewAll?: () => void;
  userName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewAll, userName }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    const channel = supabase
      .channel('dashboard-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchTransactions();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
      if (error) throw error;
      setTransactions(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const balance = totalIncome - totalExpense;

  const expensesByCategory = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc: any, curr) => {
       acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
       return acc;
    }, {});
    
  const COLORS = ['#0047FF', '#00D1FF', '#8B5CF6', '#C7D2FE'];
  const pieData = Object.keys(expensesByCategory).map((key, index) => ({
    name: key, value: expensesByCategory[key], color: COLORS[index % COLORS.length]
  })).sort((a, b) => b.value - a.value);

  const barData = [
    { name: 'MAR', value: 0 },
    { name: 'APR', value: 0 },
    { name: 'MEI', value: 0 },
    { name: 'JUN', value: 0 },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 19) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <div className="p-8 sm:p-12 space-y-10 max-w-[1400px] mx-auto w-full pb-24 bg-[#F8F9FC]">
      {/* HEADER SECTION */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {getGreeting()}, {userName || 'Pengguna'}
        </h1>
        <p className="text-slate-500 font-medium">Berikut adalah analisis modular real-time untuk aset dan likuiditas Anda.</p>
      </div>

      {/* TOP ROW: PORTFOLIO & SPENDING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Alokasi Portofolio */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-10 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-lg font-black text-slate-900">Alokasi Portofolio</h3>
                 <p className="text-xs text-slate-400 font-medium">Diversifikasi di berbagai kelas aset Anda</p>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative w-64 h-64 shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={pieData.length > 0 ? pieData : [{name: 'Kosong', value: 1, color: '#F1F5F9'}]} cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={4} dataKey="value" stroke="none">
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900">Rp 0</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Total Aset Bersih</span>
                 </div>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                 {[
                   { name: 'Rumah', color: '#8B5CF6' },
                   { name: 'Makanan', color: '#10B981' },
                   { name: 'Transportasi', color: '#F59E0B' },
                   { name: 'Hiburan', color: '#8B5CF6' },
                 ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-bold text-slate-600">{item.name}</span>
                       </div>
                       <span className="text-xs font-black text-slate-900">0%</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Pengeluaran Bulanan */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-10 shadow-sm flex flex-col">
           <div className="mb-8">
              <h3 className="text-lg font-black text-slate-900">Pengeluaran Bulanan</h3>
              <p className="text-xs text-slate-400 font-medium">Performa bulan ini vs bulan lalu</p>
           </div>
           
           <div className="flex-1 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barData}>
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                       {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 3 ? '#0047FF' : '#E2E8F0'} />
                       ))}
                    </Bar>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
           
           <div className="mt-8 pt-8 border-t border-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-400">Pengeluaran {format(new Date(), "MMMM", { locale: id })}</span>
                 <span className="text-sm font-black text-slate-900">Rp 0</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-400">Vs Bulan Lalu</span>
                 <span className="text-xs font-black text-slate-400">0% —</span>
              </div>
           </div>
        </div>
      </div>

      {/* MIDDLE ROW: KATEGORI TERATAS */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Kategori Teratas</h3>
              <div className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengeluaran Terbesar</div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
              {[
                { name: 'Makanan & Kuliner', count: 0, val: 0, icon: Utensils, bg: 'bg-indigo-50', color: 'text-indigo-600' },
                { name: 'Transportasi', count: 0, val: 0, icon: Car, bg: 'bg-cyan-50', color: 'text-cyan-600' },
                { name: 'Gaya Hidup', count: 0, val: 0, icon: ShoppingBag, bg: 'bg-slate-50', color: 'text-slate-600' },
                { name: 'Kesehatan', count: 0, val: 0, icon: Activity, bg: 'bg-rose-50', color: 'text-rose-600' },
                { name: 'Belanja', count: 0, val: 0, icon: ShoppingBag, bg: 'bg-amber-50', color: 'text-amber-600' },
                { name: 'Hiburan', count: 0, val: 0, icon: Zap, bg: 'bg-violet-50', color: 'text-violet-600' },
              ].map((cat, i) => (
                <div key={i} className="flex items-start justify-between gap-4 py-1">
                   <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                         <cat.icon size={20} />
                      </div>
                      <div className="flex flex-col">
                         <p className="text-sm font-black text-slate-900 leading-tight mb-1">{cat.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cat.count} Transaksi</p>
                      </div>
                   </div>
                   <div className="text-right shrink-0 pt-1">
                      <p className="text-sm font-black text-slate-900 tabular-nums">
                         {formatCurrency(cat.val).replace('Rp', 'Rp ')}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* BOTTOM SECTION: TRANSAKSI PENTING */}
      <div className="space-y-6">
         <h3 className="text-lg font-black text-slate-900">Transaksi Penting</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transactions.slice(0, 3).map((tx, i) => (
              <div key={i} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6 group hover:border-indigo-100 transition-all">
                 <div className="flex justify-between items-start">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                       {tx.type === 'income' ? 'Pemasukan' : 'Keluar'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{format(new Date(tx.date), "dd MMM", { locale: id })}</span>
                 </div>
                 <div>
                    <p className="text-sm font-black text-slate-900 mb-1 line-clamp-1">{tx.description}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.category}</p>
                 </div>
                 <p className={`text-xl font-black tabular-nums ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                 </p>
              </div>
            ))}
            <button className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 p-8 text-slate-400 hover:border-indigo-200 hover:text-indigo-600 transition-all group">
               <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-all">
                  <Plus size={20} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Input Manual</span>
            </button>
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
