import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Home, 
  TrendingUp,
  AlertCircle,
  X,
  Loader2,
  Trash2,
  Sparkles,
  CalendarDays,
  CalendarRange,
  CalendarDays as CalendarDailyIcon,
  Utensils,
  Car,
  ShoppingBag,
  HeartPulse,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  month: number;
  year: number;
  period: 'Harian' | 'Mingguan' | 'Bulanan';
  user_id: string;
}

interface BudgetsProps {
  onNavigate?: (tab: string) => void;
}

const Budgets: React.FC<BudgetsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Harian' | 'Mingguan' | 'Bulanan'>('Bulanan');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newBudget, setNewBudget] = useState({
    category: 'Makanan',
    amount: '',
    period: 'Bulanan' as 'Harian' | 'Mingguan' | 'Bulanan',
  });

  const categories = [
    { name: 'Makanan', icon: Utensils, color: 'bg-orange-50 text-orange-500' },
    { name: 'Transport', icon: Car, color: 'bg-blue-50 text-blue-500' },
    { name: 'Belanja', icon: ShoppingBag, color: 'bg-pink-50 text-pink-500' },
    { name: 'Kesehatan', icon: HeartPulse, color: 'bg-emerald-50 text-emerald-500' },
    { name: 'Lainnya', icon: MoreHorizontal, color: 'bg-slate-50 text-slate-500' }
  ];

  useEffect(() => {
    fetchBudgetsWithSpending();

    const channel = supabase
      .channel('budget-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchBudgetsWithSpending();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTab]); // Re-fetch when tab changes

  const fetchBudgetsWithSpending = async () => {
    try {
      setLoading(true);
      
      const { data: budgetData, error: bError } = await supabase
        .from('budgets')
        .select('*')
        .eq('period', activeTab) // Filter by period
        .order('category', { ascending: true });

      if (bError) throw bError;

      // Calculate time range based on activeTab
      const now = new Date();
      let firstDay, lastDay;

      if (activeTab === 'Bulanan') {
        firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
      } else if (activeTab === 'Mingguan') {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        firstDay = start.toISOString();
        lastDay = new Date().toISOString();
      } else {
        // Harian
        firstDay = new Date(now.setHours(0,0,0,0)).toISOString();
        lastDay = new Date(now.setHours(23,59,59,999)).toISOString();
      }

      const { data: txData, error: tError } = await supabase
        .from('transactions')
        .select('category, amount')
        .eq('type', 'expense')
        .gte('date', firstDay)
        .lte('date', lastDay);

      if (tError) throw tError;

      const spendingMap = (txData || []).reduce((acc: any, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
        return acc;
      }, {});

      const enrichedBudgets = (budgetData || []).map(b => ({
        ...b,
        spent: spendingMap[b.category] || 0
      }));

      setBudgets(enrichedBudgets);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    } finally {
      setTimeout(() => setLoading(false), 500); // Slight delay for smooth skeleton
    }
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      const now = new Date();
      const { error } = await supabase.from('budgets').insert([
        {
          category: newBudget.category,
          amount: Number(newBudget.amount),
          period: newBudget.period,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          user_id: userId
        }
      ]);

      if (error) throw error;
      setIsModalOpen(false);
      setNewBudget({ ...newBudget, amount: '' });
      fetchBudgetsWithSpending();
    } catch (err: any) {
      alert("Gagal membuat anggaran: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (!confirm("Hapus anggaran ini?")) return;
    try {
      const { error } = await supabase.from('budgets').delete().eq('id', id);
      if (error) throw error;
      fetchBudgetsWithSpending();
    } catch (err) { console.error(err); }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const totalBudget = budgets.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Anggaran / Budget</h2>
          <p className="text-slate-500 font-medium mt-1">Pantau sisa anggaran Anda sesuai periode.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-3">
          <Plus size={20} />
          <span>Buat Budget</span>
        </button>
      </header>

      {/* Period Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-[24px] w-fit border border-slate-200">
        {['Harian', 'Mingguan', 'Bulanan'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2.5 rounded-[18px] text-xs font-black transition-all ${activeTab === tab ? "bg-white text-violet-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"}`}>{tab}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-slate-100 p-8 sm:p-10 rounded-[40px] shadow-sm relative overflow-hidden">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pemakaian Anggaran {activeTab}</p>
                   <h3 className="text-2xl font-black text-slate-900 mb-4">{formatCurrency(totalSpent)}</h3>
                   <p className="text-slate-400 text-sm font-bold">Terpakai dari {formatCurrency(totalBudget)}</p>
                </div>
                <div className="flex flex-col justify-end">
                   <div className="flex justify-between items-end mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${overallProgress > 90 ? 'text-rose-500' : 'text-slate-900'}`}>{Math.round(overallProgress)}% Terpakai</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sisa {formatCurrency(totalBudget - totalSpent)}</span>
                   </div>
                   <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${Math.min(overallProgress, 100)}%` }} 
                        className={`h-full rounded-full transition-colors duration-500 ${
                          overallProgress >= 100 ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]' : 
                          overallProgress > 80 ? 'bg-amber-500' : 
                          'bg-emerald-500'
                        }`} 
                      />
                </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="bg-white border border-slate-100 p-8 rounded-[36px] shadow-sm h-64 skeleton" />
              ))
            ) : budgets.length === 0 ? (
              <div className="col-span-full py-16 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center gap-4 text-center"><p className="text-slate-400 font-bold text-sm">Belum ada budget {activeTab.toLowerCase()}.</p></div>
            ) : (
              budgets.map((budget, i) => {
                const progress = (budget.spent / budget.amount) * 100;
                const categoryInfo = categories.find(c => c.name === budget.category) || categories[4];
                const Icon = categoryInfo.icon;

                return (
                  <motion.div key={budget.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white border border-slate-100 p-8 rounded-[36px] shadow-sm hover:shadow-md transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 ${categoryInfo.color} rounded-2xl flex items-center justify-center transition-all`}>
                           <Icon size={22} />
                        </div>
                        <button onClick={() => handleDeleteBudget(budget.id)} className="p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                     </div>
                     <h4 className="font-black text-slate-900 text-lg mb-1">{budget.category}</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Sisa {activeTab}: {formatCurrency(budget.amount - budget.spent)}</p>
                     <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className={progress > 100 ? "text-rose-500" : "text-slate-900"}>{formatCurrency(budget.spent)}</span>
                           <span className="text-slate-400">{formatCurrency(budget.amount)}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${Math.min(progress, 100)}%` }} 
                            className={`h-full rounded-full transition-colors duration-500 ${
                              progress >= 100 ? 'bg-rose-500' : 
                              progress > 80 ? 'bg-amber-500' : 
                              'bg-emerald-500'
                            }`} 
                           />
                        </div>
                     </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><Sparkles size={20} className="text-amber-400" /> Analisis Cepat</h3>
              <div className="space-y-6">
                 {budgets.some(b => b.spent > b.amount) && (
                   <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Peringatan!</p>
                      <p className="text-xs text-slate-600 font-bold">Anda telah melebihi budget di beberapa kategori.</p>
                   </div>
                 )}
                 <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                   Sistem secara otomatis menghitung setiap pengeluaran yang Anda catat di menu <b>Transaksi</b> dan memasukkannya ke sini.
                 </p>
                 <button 
                   onClick={() => onNavigate && onNavigate('Analysis')}
                   className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline"
                 >
                   Lihat Detail Analisis →
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[32px] w-full max-w-md z-10 shadow-2xl">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">🎯 Budget Baru</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddBudget} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Kategori</label>
                    <select value={newBudget.category} onChange={(e) => setNewBudget({...newBudget, category: e.target.value})} className="input-field w-full text-sm font-bold">
                      {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Periode</label>
                    <select value={newBudget.period} onChange={(e) => setNewBudget({...newBudget, period: e.target.value as any})} className="input-field w-full text-sm font-bold">
                      <option value="Harian">Harian</option>
                      <option value="Mingguan">Mingguan</option>
                      <option value="Bulanan">Bulanan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Batas Nominal</label>
                    <input type="number" required value={newBudget.amount} onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})} className="input-field w-full font-black text-xl" placeholder="0" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? "Menyimpan..." : "Buat Anggaran"}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Budgets;
