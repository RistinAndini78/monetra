import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Wallet as WalletIcon, 
  Banknote, 
  CreditCard, 
  Smartphone, 
  ArrowRightLeft, 
  MoreVertical,
  X,
  TrendingUp,
  Loader2,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

interface Wallet {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'e-wallet' | 'investment';
  balance: number;
  color: string;
  icon: string;
  is_default: boolean;
}

const Wallet: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newWallet, setNewWallet] = useState({
    name: '', type: 'bank' as any, balance: '', color: '#8B5CF6'
  });

  const walletColors = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#6366F1'];

  useEffect(() => { fetchWallets(); }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('wallets').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      setWallets(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      const { error } = await supabase.from('wallets').insert([{
        name: newWallet.name, type: newWallet.type, balance: Number(newWallet.balance), color: newWallet.color, user_id: userId
      }]);
      if (error) throw error;
      setIsModalOpen(false);
      setNewWallet({ name: '', type: 'bank', balance: '', color: '#8B5CF6' });
      fetchWallets();
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  const handleDeleteWallet = async (id: string) => {
    if (!confirm("Hapus dompet ini?")) return;
    try {
      const { error } = await supabase.from('wallets').delete().eq('id', id);
      if (error) throw error;
      fetchWallets();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Dompet</h2>
          <p className="text-slate-500 font-medium mt-1">Atur penyimpanan uang Anda di berbagai akun.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-3">
          <Plus size={20} /> <span>Tambah Dompet</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
           <div className="col-span-full py-20 flex flex-col items-center gap-4">
              <Loader2 className="text-violet-500 animate-spin" size={40} />
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Menyiapkan brankas...</p>
           </div>
        ) : wallets.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 border border-slate-100"><WalletIcon size={40} /></div>
             <p className="text-slate-900 font-black text-lg">Belum ada dompet</p>
          </div>
        ) : (
          wallets.map((wallet) => (
            <motion.div key={wallet.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative group h-[220px]">
              <div className="absolute inset-0 rounded-[40px] opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" style={{ backgroundColor: wallet.color }} />
              <div className="relative h-full bg-white border border-slate-100 rounded-[40px] p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all group-hover:border-violet-100">
                 <div className="flex justify-between items-start z-10">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-900 shadow-sm border border-slate-100 group-hover:bg-violet-600 group-hover:text-white transition-all">
                       <CreditCard size={24} />
                    </div>
                    <button onClick={() => handleDeleteWallet(wallet.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                 </div>
                 <div className="z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{wallet.type}</p>
                    <h3 className="text-xl font-black text-slate-900 mb-4">{wallet.name}</h3>
                    <p className="text-2xl font-black text-slate-900 tabular-nums">
                       {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(wallet.balance)}
                    </p>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[32px] w-full max-w-md overflow-hidden flex flex-col z-10 shadow-2xl">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">💳 Dompet Baru</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddWallet} className="p-8 space-y-6">
                <div className="space-y-4">
                  <input type="text" required value={newWallet.name} onChange={(e) => setNewWallet({...newWallet, name: e.target.value})} className="input-field w-full" placeholder="Nama Akun (e.g. BCA, GoPay)" />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tipe Akun</label>
                    <select value={newWallet.type} onChange={(e) => setNewWallet({...newWallet, type: e.target.value})} className="input-field w-full text-sm font-bold">
                      <option value="bank">Bank Account</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  <input type="number" required value={newWallet.balance} onChange={(e) => setNewWallet({...newWallet, balance: e.target.value})} className="input-field w-full font-black text-xl" placeholder="Saldo Awal" />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? "Menyimpan..." : "Buat Dompet"}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
