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
  ArrowRight,
} from "lucide-react";
import PushNotificationService from "../lib/notifications";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { format, subMonths } from "date-fns";
import { id } from "date-fns/locale";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, Tooltip, 
} from "recharts";

interface DashboardProps {
  onViewAll?: () => void;
  userName?: string;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

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
      
      // Smart Check untuk Tagihan Jatuh Tempo Hari Ini
      checkDueBills();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const checkDueBills = async () => {
    try {
       // Menggunakan waktu lokal agar pas dengan Indonesia
       const today = new Date().toLocaleDateString('en-CA'); // format YYYY-MM-DD
       console.log("Memulai Smart Check... Tanggal hari ini:", today);

       const { data: dueBills, error } = await supabase
         .from('bills')
         .select('*')
         .eq('due_date', today)
         .eq('status', 'upcoming');

       if (error) {
         console.error("Error saat ambil data tagihan:", error);
         return;
       }

       console.log("Tagihan ditemukan:", dueBills?.length || 0);

       if (dueBills && dueBills.length > 0) {
          const { data: userData } = await supabase.auth.getUser();
          
          for (const bill of dueBills) {
             console.log("Mengirim notifikasi untuk:", bill.name);
             
             // 1. Kirim Notifikasi Web (Lonceng)
             const { error: notifError } = await supabase.from('notifications').insert([{
                user_id: userData.user?.id,
                title: '⚠️ Tagihan Jatuh Tempo!',
                message: `Tagihan "${bill.name}" sebesar ${formatCurrency(bill.amount)} jatuh tempo HARI INI.`,
                type: 'warning'
             }]);

             if (notifError) console.error("Gagal simpan notifikasi ke DB:", notifError);
          }
       }
    } catch (err) { console.error("Smart check failed", err); }
  };

  // 1. Kalkulasi Statistik Utama
  const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const balance = totalIncome - totalExpense;

  // 2. Kalkulasi Data Chart Pie (Kategori)
  const expensesByCategory = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc: any, curr) => {
       acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
       return acc;
    }, {});
    
  const COLORS = ['#8B5CF6', '#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#64748B'];
  const pieData = Object.keys(expensesByCategory).map((key, index) => ({
    name: key, 
    value: expensesByCategory[key], 
    color: COLORS[index % COLORS.length],
    percent: Math.round((expensesByCategory[key] / totalExpense) * 100) || 0
  })).sort((a, b) => b.value - a.value).slice(0, 4);

  // 3. Kalkulasi Data Chart Bar (Per Bulan)
  const currentMonth = new Date().getMonth();
  const barData = Array.from({ length: 4 }).map((_, i) => {
    const d = subMonths(new Date(), 3 - i);
    const monthKey = format(d, 'yyyy-MM');
    const monthlyTotal = transactions
      .filter(tx => tx.type === 'expense' && tx.date.startsWith(monthKey))
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    return {
      name: format(d, 'MMM').toUpperCase(),
      value: monthlyTotal
    };
  });

  // 4. Kalkulasi Kategori Teratas (List)
  const topCategories = Object.keys(expensesByCategory).map(name => ({
    name,
    val: expensesByCategory[name],
    count: transactions.filter(t => t.category === name).length
  })).sort((a, b) => b.val - a.val).slice(0, 6);


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 19) return "Selamat Sore";
    return "Selamat Malam";
  };

  const getCategoryIcon = (name: string) => {
     const n = name.toLowerCase();
     if (n.includes('makan') || n.includes('kuliner')) return Utensils;
     if (n.includes('transport')) return Car;
     if (n.includes('belanja')) return ShoppingBag;
     if (n.includes('tagihan') || n.includes('utilitas')) return Zap;
     return Activity;
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="p-10 space-y-10 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="h-10 w-64 skeleton" />
            <div className="h-4 w-48 skeleton" />
          </div>
          <div className="h-24 w-64 rounded-[32px] skeleton hidden md:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 rounded-[32px] skeleton" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 rounded-[40px] skeleton" />
          <div className="h-96 rounded-[40px] skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-12 space-y-10 max-w-[1400px] mx-auto w-full pb-24 bg-[#F8F9FC]">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">
              {getGreeting()}, {userName || 'Pengguna'}
            </h1>
          </div>
          <p className="text-slate-500 font-medium tracking-tight">Berikut adalah analisis modular real-time untuk aset dan likuiditas Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between h-[160px] group hover:border-violet-100 transition-all">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Aset Bersih</p>
           <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(balance)}</h2>
              <p className="text-[10px] font-bold text-emerald-500 mt-2 uppercase tracking-wider flex items-center gap-1">
                 <ArrowUpRight size={12} /> Saldo Stabil
              </p>
           </div>
        </div>
        <div 
          onClick={() => onViewAll && onViewAll()}
          className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between h-[160px] cursor-pointer group hover:border-emerald-100 transition-all"
        >
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pemasukan</p>
           <div>
              <h2 className="text-2xl font-black text-emerald-600 tracking-tight">{formatCurrency(totalIncome)}</h2>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Bulan Ini</p>
           </div>
        </div>
        <div 
          onClick={() => onViewAll && onViewAll()}
          className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between h-[160px] cursor-pointer group hover:border-rose-100 transition-all"
        >
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pengeluaran</p>
           <div>
              <h2 className="text-2xl font-black text-rose-600 tracking-tight">{formatCurrency(totalExpense)}</h2>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Bulan Ini</p>
           </div>
        </div>
      </div>

      {/* TOP ROW: PORTFOLIO & SPENDING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Alokasi Portofolio */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-lg font-black text-slate-900">Alokasi Pengeluaran</h3>
                 <p className="text-xs text-slate-400 font-medium">Distribusi dana berdasarkan kategori</p>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative w-64 h-64 shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                         data={pieData.length > 0 ? pieData : [{name: 'Kosong', value: 1, color: '#F1F5F9'}]} 
                         cx="50%" cy="50%" 
                         innerRadius={75} 
                         outerRadius={105} 
                         paddingAngle={4} 
                         dataKey="value" 
                         stroke="none"
                       >
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          {pieData.length === 0 && <Cell fill="#F1F5F9" />}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Bulan Ini</span>
                    <span className="text-xl font-black text-slate-900 line-clamp-1">{formatCurrency(totalExpense)}</span>
                 </div>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                 {pieData.length > 0 ? pieData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-bold text-slate-600">{item.name}</span>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-slate-900">{formatCurrency(item.value)}</p>
                          <p className="text-[10px] font-black text-slate-400">{item.percent}%</p>
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-10">
                       <p className="text-xs font-bold text-slate-400 italic">Belum ada pengeluaran bulan ini</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Pengeluaran Bulanan */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm flex flex-col">
           <div className="mb-8">
              <h3 className="text-lg font-black text-slate-900">Histori Bulanan</h3>
              <p className="text-xs text-slate-400 font-medium">Tren pengeluaran 4 bulan terakhir</p>
           </div>
           
           <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barData}>
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                       {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 3 ? '#8B5CF6' : '#F1F5F9'} />
                       ))}
                    </Bar>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
           
           <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
              <div className="flex justify-between items-center bg-emerald-50/50 p-4 rounded-2xl">
                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Pemasukan</span>
                 <span className="text-sm font-black text-emerald-700">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="flex justify-between items-center bg-rose-50/50 p-4 rounded-2xl">
                 <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Total Pengeluaran</span>
                 <span className="text-sm font-black text-rose-700">{formatCurrency(totalExpense)}</span>
              </div>
           </div>
        </div>
      </div>

      {/* MIDDLE ROW: KATEGORI TERATAS */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Kategori Teratas</h3>
              <div className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Sepanjang Waktu</div>
           </div>
           {topCategories.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                {topCategories.map((cat, i) => {
                  const Icon = getCategoryIcon(cat.name);
                  return (
                    <div key={i} className="flex items-start justify-between gap-4 py-1">
                       <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                             <Icon size={20} />
                          </div>
                          <div className="flex flex-col">
                             <p className="text-sm font-black text-slate-900 leading-tight mb-1">{cat.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cat.count} Transaksi</p>
                          </div>
                       </div>
                       <div className="text-right shrink-0 pt-1">
                          <p className="text-sm font-black text-slate-900 tabular-nums">
                             {formatCurrency(cat.val)}
                          </p>
                       </div>
                    </div>
                  );
                })}
             </div>
           ) : (
             <div className="text-center py-20 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                <p className="text-sm font-bold text-slate-400">Belum ada transaksi pengeluaran</p>
             </div>
           )}
        </div>
      </div>

      {/* BOTTOM SECTION: TRANSAKSI PENTING */}
      <div className="space-y-6">
         <div className="flex items-end justify-between mb-8">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Transaksi Terbaru</h2>
          <button 
            onClick={onViewAll}
            className="text-[10px] font-black text-violet-600 hover:text-violet-700 transition-colors uppercase tracking-[0.2em]"
          >
            Lihat Semua
          </button>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transactions.slice(0, 3).map((tx, i) => (
              <div key={i} className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm space-y-6 group hover:border-violet-100 transition-all hover:shadow-xl hover:shadow-slate-200/20">
                 <div className="flex justify-between items-start">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                       {tx.type === 'income' ? 'Masuk' : 'Keluar'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{format(new Date(tx.date), "dd MMM yyyy", { locale: id })}</span>
                 </div>
                 <div>
                    <p className="text-sm font-black text-slate-900 mb-1 line-clamp-1">{tx.description || tx.category}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{tx.category}</p>
                 </div>
                 <p className={`text-xl font-black tabular-nums ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount).replace('Rp', 'Rp ')}
                 </p>
              </div>
            ))}
            {transactions.length === 0 && (
            <div className="w-full py-12 bg-slate-50 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
              <p className="text-slate-400 font-bold text-sm">Belum ada transaksi tercatat.</p>
            </div>
          )}
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
