import React, { useState, useEffect } from "react";
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
  Sparkles,
  Loader2
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
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { id } from "date-fns/locale";

const Analysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    savingsRate: 0
  });
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const { data: tx, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      // 1. Process Monthly Cash Flow (Last 6 Months)
      const months = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), 5 - i);
        return {
          name: format(d, 'MMM'),
          monthKey: format(d, 'yyyy-MM'),
          income: 0,
          expenses: 0
        };
      });

      tx?.forEach(t => {
        const mKey = t.date.substring(0, 7);
        const month = months.find(m => m.monthKey === mKey);
        if (month) {
          if (t.type === 'income') month.income += Number(t.amount);
          else month.expenses += Number(t.amount);
        }
      });
      setCashFlowData(months);

      // 2. Process Category Distribution (This Month)
      const thisMonthKey = format(new Date(), 'yyyy-MM');
      const categoryMap: any = {};
      let totalExp = 0;
      let totalInc = 0;

      tx?.forEach(t => {
        if (t.date.startsWith(thisMonthKey)) {
          if (t.type === 'expense') {
            categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
            totalExp += Number(t.amount);
          } else {
            totalInc += Number(t.amount);
          }
        }
      });

      const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#64748B'];
      const processedCategories = Object.keys(categoryMap).map((name, i) => ({
        name,
        value: categoryMap[name],
        color: colors[i % colors.length]
      }));

      setCategoryData(processedCategories.length > 0 ? processedCategories : [{ name: "Belum Ada", value: 1, color: "#F1F5F9" }]);
      
      const savingsRate = totalInc > 0 ? Math.round(((totalInc - totalExp) / totalInc) * 100) : 0;
      setStats({
        totalIncome: totalInc,
        totalExpenses: totalExp,
        savingsRate
      });

      // 3. Generate Smart Insights
      const newInsights = [];
      if (totalExp > totalInc && totalInc > 0) {
        newInsights.push("⚠️ Bahaya! Pengeluaran Anda melebihi pemasukan bulan ini.");
      } else if (savingsRate > 30) {
        newInsights.push("🎉 Luar biasa! Tingkat tabungan Anda sangat sehat bulan ini.");
      }
      
      if (categoryMap['Makanan'] > totalExp * 0.4) {
        newInsights.push("🍔 Waduh, jajan makanan memakan hampir setengah budget Anda! Coba kurangi ya.");
      }
      
      if (newInsights.length === 0) {
        newInsights.push("✨ Belum ada tren mencolok. Terus catat transaksi Anda!");
      }
      setInsights(newInsights);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Menganalisis Data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Analisis Keuangan</h2>
          <p className="text-slate-400 font-medium tracking-tight">Wawasan mendalam tentang pola finansial Anda.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-1 flex items-center gap-2 shadow-sm">
             <button className="px-4 py-2 text-xs font-black bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/20">6 Bulan Terakhir</button>
          </div>
        </div>
      </header>

      {/* NEW: Smart Insights AI Section */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-violet-600/20">
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-yellow-300" />
               </div>
               <h3 className="text-xl font-black">Insight Cerdas (AI)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {insights.map((msg, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl font-bold text-sm leading-relaxed"
                 >
                   {msg}
                 </motion.div>
               ))}
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Cash Flow Linear Chart */}
        <div className="xl:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Tren Arus Kas</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pemasukan vs Pengeluaran</p>
              </div>
           </div>
           
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 900}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    itemStyle={{fontSize: '12px', fontWeight: 900}}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorInc)" />
                  <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={4} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Expense Category Donut */}
        <div className="xl:col-span-4 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
           <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Kategori</h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Bulan Ini</p>
           
           <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pengeluaran</span>
                <span className="text-xl font-black text-slate-900">{formatCurrency(stats.totalExpenses)}</span>
              </div>
           </div>

           <div className="space-y-3 mt-8">
              {categoryData.filter(c => c.name !== "Belum Ada").map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-black text-slate-700">{cat.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{formatCurrency(cat.value)}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Total Pemasukan</p>
            <h4 className="text-2xl font-black text-emerald-900">{formatCurrency(stats.totalIncome)}</h4>
         </div>
         <div className="bg-rose-50 p-8 rounded-[32px] border border-rose-100">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4">Total Pengeluaran</p>
            <h4 className="text-2xl font-black text-rose-900">{formatCurrency(stats.totalExpenses)}</h4>
         </div>
         <div className="bg-violet-50 p-8 rounded-[32px] border border-violet-100">
            <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-4">Tingkat Tabungan</p>
            <h4 className="text-2xl font-black text-violet-900">{stats.savingsRate}%</h4>
         </div>
      </div>
    </div>
  );
};

export default Analysis;

