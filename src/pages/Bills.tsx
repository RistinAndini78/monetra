import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Cloud,
  Zap,
  Home,
  Loader2,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { format, parseISO } from "date-fns";

interface Bill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  category: string;
  status: "paid" | "upcoming" | "overdue";
  user_id: string;
}

const Bills: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    due_date: '',
    category: 'Utilitas'
  });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setBills(data || []);
    } catch (err) {
      console.error("Error fetching bills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBill.name || !newBill.amount || !newBill.due_date) {
      alert("Mohon isi semua data!");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('bills').insert([{
        name: newBill.name,
        amount: Number(newBill.amount),
        due_date: newBill.due_date,
        category: newBill.category,
        user_id: userData.user?.id
      }]);

      if (error) throw error;
      
      setShowModal(false);
      setNewBill({ name: '', amount: '', due_date: '', category: 'Utilitas' });
      fetchBills();
    } catch (err: any) {
      alert("Gagal menambah tagihan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBill = async (id: string) => {
    if (!confirm("Hapus tagihan ini?")) return;
    try {
      const { error } = await supabase.from('bills').delete().eq('id', id);
      if (error) throw error;
      fetchBills();
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const totalKewajiban = bills.reduce((acc, curr) => acc + curr.amount, 0);
  const upcomingCount = bills.filter(b => b.status === 'upcoming').length;

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pengingat Tagihan</h2>
          <p className="text-slate-400 font-medium">Kelola dan pantau kewajiban finansial rutin Anda.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-violet-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-violet-700 active:scale-95 transition-all shadow-xl shadow-violet-600/20"
          >
            <Plus size={20} />
            <span>Tambah Tagihan Baru</span>
          </button>
        </div>
      </header>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Kewajiban", value: formatCurrency(totalKewajiban), trend: `${bills.length} Tagihan Terdaftar`, color: "text-slate-900" },
          { label: "Tagihan Mendatang", value: `${upcomingCount} Tagihan`, trend: "Perlu disiapkan", color: "text-rose-500" },
          { label: "Status Database", value: loading ? "Loading..." : "Terhubung", trend: "Sinkronisasi Real-time", color: "text-emerald-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-[160px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-wider">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kalender / Daftar Tagihan */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
           <h3 className="text-xl font-black text-slate-900 mb-8">Daftar Tagihan Aktif</h3>
           
           {loading ? (
             <div className="flex flex-col items-center py-20 text-slate-300">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">Mengambil data...</p>
             </div>
           ) : bills.length === 0 ? (
             <div className="flex flex-col items-center py-20 border-2 border-dashed border-slate-50 rounded-[32px]">
                <p className="text-slate-400 font-bold">Belum ada tagihan.</p>
             </div>
           ) : (
             <div className="space-y-4">
                {bills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-violet-100 transition-all group">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-violet-600 shadow-sm">
                           <CreditCard size={20} />
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900">{bill.name}</h4>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo: {format(parseISO(bill.due_date), 'dd MMM yyyy')}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-8">
                        <div className="text-right">
                           <p className="font-black text-slate-900">{formatCurrency(bill.amount)}</p>
                           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{bill.category}</p>
                        </div>
                        <button onClick={() => handleDeleteBill(bill.id)} className="p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-violet-600 p-10 rounded-[40px] text-white shadow-xl shadow-violet-600/20 relative overflow-hidden">
              <div className="relative z-10">
                 <Bell size={32} className="mb-6" />
                 <h3 className="text-xl font-black mb-2">Email Pengingat</h3>
                 <p className="text-violet-100 text-sm font-medium leading-relaxed">
                    Setiap tagihan yang Anda buat akan otomatis mengirimkan email pengingat 3 hari sebelum tanggal jatuh tempo.
                 </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
           </div>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-10 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pengingat Tagihan Baru</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddBill} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nama Tagihan</label>
                  <input 
                    type="text" 
                    required
                    value={newBill.name}
                    onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                    placeholder="misal: Langganan Netflix"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Jumlah (Rp)</label>
                    <input 
                      type="number" 
                      required
                      value={newBill.amount}
                      onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                      placeholder="0"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tanggal Tempo</label>
                    <input 
                      type="date" 
                      required
                      value={newBill.due_date}
                      onChange={(e) => setNewBill({...newBill, due_date: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                  <select 
                    value={newBill.category}
                    onChange={(e) => setNewBill({...newBill, category: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold appearance-none"
                  >
                    <option value="Utilitas">Utilitas</option>
                    <option value="Hiburan">Hiburan</option>
                    <option value="Langganan">Langganan</option>
                    <option value="Rumah">Rumah</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-violet-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-violet-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-violet-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Buat Pengingat"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bills;

