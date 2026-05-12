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
import { motion, AnimatePresence } from "framer-motion";
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

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
    checkDueBills();
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

  const checkDueBills = async () => {
    try {
      const today = new Date().toLocaleDateString('en-CA'); // format YYYY-MM-DD
      const { data: dueBills } = await supabase
        .from('bills')
        .select('*')
        .eq('due_date', today)
        .eq('status', 'upcoming');

      if (dueBills && dueBills.length > 0) {
        const { data: userData } = await supabase.auth.getUser();
        for (const bill of dueBills) {
          // Cek dulu apakah notifikasi hari ini sudah pernah dikirim
          const { data: existingNotif } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', userData.user?.id)
            .ilike('message', `%${bill.name}%jatuh tempo HARI INI%`)
            .gte('created_at', new Date().toISOString().split('T')[0]);

          if (existingNotif && existingNotif.length > 0) continue; // sudah pernah dikirim hari ini

          // Kirim notifikasi web
          await supabase.from('notifications').insert([{
            user_id: userData.user?.id,
            title: '⚠️ Tagihan Jatuh Tempo!',
            message: `Tagihan "${bill.name}" sebesar ${formatCurrency(bill.amount)} jatuh tempo HARI INI.`,
            type: 'warning'
          }]);
        }
      }
    } catch (err) { console.error("checkDueBills error:", err); }
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

  const handlePayBill = async (bill: Bill) => {
    // 1. Cek apakah sedang proses atau sudah lunas
    if (isSubmitting || bill.status === 'paid') return;
    
    if (!confirm(`Bayar tagihan "${bill.name}" sebesar ${formatCurrency(bill.amount)}?`)) return;

    try {
      setIsSubmitting(true);
      
      // 2. Cek ulang status terbaru dari database (antisipasi double click cepat)
      const { data: latestBill } = await supabase
        .from('bills')
        .select('status')
        .eq('id', bill.id)
        .single();
        
      if (latestBill?.status === 'paid') {
        alert("Tagihan ini sudah dibayar sebelumnya.");
        return;
      }

      // 3. Buat transaksi pengeluaran otomatis
      const { error: txError } = await supabase.from('transactions').insert([{
        type: 'expense',
        amount: bill.amount,
        category: bill.category,
        date: new Date().toISOString().split('T')[0],
        description: `Pembayaran Tagihan: ${bill.name}`,
        user_id: bill.user_id
      }]);

      if (txError) throw txError;

      // 4. Update status tagihan jadi 'paid'
      // 4. Send Notification
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from('notifications').insert([{
        user_id: userData?.user?.id,
        title: '✅ Tagihan Lunas!',
        message: `Tagihan "${bill.name}" sebesar ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bill.amount)} telah dibayar.`,
        type: 'success'
      }]);

      const { error: billError } = await supabase
        .from('bills')
        .update({ status: 'paid' })
        .eq('id', bill.id);

      if (billError) throw billError;

      alert("Tagihan berhasil dibayar!");
      fetchBills();
    } catch (err: any) {
      alert("Gagal membayar tagihan: " + err.message);
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

  const totalKewajiban = bills.filter(b => b.status !== 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const upcomingCount = bills.filter(b => b.status === 'upcoming').length;

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Notifikasi & Tagihan</h2>
          <p className="text-slate-400 font-medium">Pantau semua pengingat dan kewajiban pembayaran Anda.</p>
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
          { label: "Sisa Kewajiban", value: formatCurrency(totalKewajiban), trend: `${bills.filter(b => b.status !== 'paid').length} Belum Dibayar`, color: "text-slate-900" },
          { label: "Tagihan Mendatang", value: `${upcomingCount} Tagihan`, trend: "Perlu disiapkan", color: "text-rose-500" },
          { label: "Sudah Dibayar", value: formatCurrency(bills.filter(b => b.status === 'paid').reduce((a, c) => a + c.amount, 0)), trend: "Bulan ini", color: "text-emerald-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-[160px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <div>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-wider">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kalender / Daftar Tagihan */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
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
             <div className="space-y-6">
                {bills.map((bill) => (
                  <div key={bill.id} className={`flex items-center justify-between p-6 rounded-[32px] border transition-all group ${bill.status === 'paid' ? 'bg-[#F2FBF9] border-[#E6F6F2]' : 'bg-slate-50/50 border-slate-100 hover:border-violet-100'}`}>
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${bill.status === 'paid' ? 'bg-[#10B981] text-white' : 'bg-white text-violet-600'}`}>
                           {bill.status === 'paid' ? <CheckCircle2 size={24} /> : <CreditCard size={24} />}
                        </div>
                        <div>
                           <h4 className={`text-base font-black ${bill.status === 'paid' ? 'text-slate-900' : 'text-slate-900'}`}>{bill.name}</h4>
                           <p className={`text-[10px] font-bold uppercase tracking-widest ${bill.status === 'paid' ? 'text-[#10B981]' : 'text-slate-400'}`}>
                             {bill.status === 'paid' ? 'LUNAS' : `TEMPO: ${format(parseISO(bill.due_date), 'dd MMM yyyy')}`}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-12">
                        <div className="text-right">
                           <p className="text-lg font-black text-slate-900">{formatCurrency(bill.amount)}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bill.category}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           {bill.status !== 'paid' && (
                             <button 
                               onClick={() => handlePayBill(bill)}
                               className="px-5 py-2.5 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20"
                             >
                               Bayar
                             </button>
                           )}
                           <button onClick={() => handleDeleteBill(bill.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-all">
                              <Trash2 size={20} />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4">
           <div className="bg-[#7C3AED] p-10 rounded-[48px] text-white shadow-2xl shadow-violet-600/30 relative overflow-hidden min-h-[340px] flex flex-col justify-center">
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                    <Bell size={28} className="text-white" />
                 </div>
                 <h3 className="text-xl font-black mb-4 tracking-tight">Email Pengingat</h3>
                 <p className="text-violet-100 text-sm font-medium leading-relaxed opacity-90">
                    Setiap tagihan yang Anda buat akan otomatis mengirimkan email pengingat 3 hari sebelum tanggal jatuh tempo.
                 </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
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

