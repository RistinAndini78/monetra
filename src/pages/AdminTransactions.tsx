import React, { useState, useEffect } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Download,
  Calendar,
  Activity,
  History
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchGlobalTransactions();
  }, []);

  const fetchGlobalTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, user_profiles(full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user_profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-violet-600" size={16} />
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.3em]">Global Ledger</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Monitoring Transaksi</h2>
          <p className="text-slate-400 font-medium mt-1">Pantau seluruh aliran dana masuk dan keluar dari seluruh pengguna.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-violet-600 transition-all shadow-sm">
             <Download size={20} />
          </button>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari user atau transaksi..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none w-80 focus:ring-4 ring-violet-50 transition-all shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-violet-600">
                 <History size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Arus Kas Seluruh Sistem</h3>
           </div>
           <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-600/20">Semua</button>
              <button className="px-5 py-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest">Pemasukan</button>
              <button className="px-5 py-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest">Pengeluaran</button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengguna</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Keterangan</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-sm">Menarik data transaksi...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                       <Activity className="text-slate-200" size={32} />
                    </div>
                    <p className="text-slate-400 font-bold text-lg">Belum ada transaksi</p>
                    <p className="text-slate-300 text-sm mt-1">Data akan muncul otomatis saat user membuat transaksi.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 text-[10px]">
                          {t.user_profiles?.full_name?.charAt(0) || "U"}
                        </div>
                        <p className="text-sm font-bold text-slate-900">{t.user_profiles?.full_name || "Unknown"}</p>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <p className="text-sm font-black text-slate-900">{t.description}</p>
                    </td>
                    <td className="py-6 px-6">
                       <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                         {t.category}
                       </span>
                    </td>
                    <td className="py-6 px-6 text-xs font-bold text-slate-400">
                      {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-6 px-10 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <span className={`text-sm font-black ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                           {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString()}
                         </span>
                         {t.type === 'income' ? (
                           <ArrowDownLeft size={14} className="text-emerald-500" />
                         ) : (
                           <ArrowUpRight size={14} className="text-rose-500" />
                         )}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
