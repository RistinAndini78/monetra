import React, { useState } from "react";
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
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  status: "paid" | "upcoming" | "overdue";
  icon: React.ReactNode;
  color: string;
}

const Bills: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const upcomingBills: Bill[] = [];

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pengingat Tagihan</h2>
          <p className="text-slate-400 font-medium">Kelola dan pantau kewajiban finansial rutin Anda.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-white border border-slate-100 p-3 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
             <CalendarIcon size={20} />
          </button>
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
          { label: "Total Kewajiban", value: formatCurrency(0), trend: "Belum ada data", color: "text-slate-900" },
          { label: "Mendatang (7 hari)", value: "0 Tagihan", trend: "Total Rp0", color: "text-rose-500" },
          { label: "Dibayar bulan ini", value: formatCurrency(0), trend: "0% dari total tagihan", color: "text-emerald-500" },
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
        {/* Kalender */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900">November 2024</h3>
            <div className="flex gap-2">
              <button className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-50 border border-slate-50 rounded-2xl overflow-hidden">
            {["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"].map(day => (
              <div key={day} className="bg-white p-4 text-center">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{day}</span>
              </div>
            ))}
            {/* Mock hari kalender */}
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const hasBill = dayNum === 4 || dayNum === 7 || dayNum === 12;
              const isPaid = dayNum === 1;
              
              return (
                <div key={i} className="bg-white h-24 p-4 border-t border-slate-50 relative group cursor-pointer hover:bg-slate-50/50 transition-colors">
                  <span className={`text-xs font-black text-slate-400`}>{dayNum}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daftar Tagihan Mendatang */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900">Tagihan Mendatang</h3>
              <div className="w-8 h-8 bg-violet-600/5 rounded-lg flex items-center justify-center text-violet-600">
                 <Bell size={16} />
              </div>
            </div>

              {upcomingBills.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-100 rounded-[24px]">
                  <AlertCircle size={24} className="text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-900">Belum ada tagihan</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">Anda tidak memiliki tagihan mendatang.</p>
                </div>
              )}
            </div>

          <button className="w-full mt-12 text-violet-600 text-xs font-black hover:underline uppercase tracking-[0.2em] py-4 border-t border-slate-50">
            Lihat Semua Jadwal
          </button>
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

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nama Tagihan</label>
                  <input 
                    type="text" 
                    placeholder="misal: Langganan Netflix"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Jumlah (Rp)</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tanggal Tempo</label>
                    <input 
                      type="date" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold appearance-none">
                    <option>Utilitas</option>
                    <option>Hiburan</option>
                    <option>Langganan</option>
                    <option>Rumah</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                   <input type="checkbox" id="auto" className="w-4 h-4 rounded border-slate-200 text-violet-600 focus:ring-violet-600/20" />
                   <label htmlFor="auto" className="text-sm font-bold text-slate-500">Aktifkan email pengingat otomatis</label>
                </div>

                <button className="w-full bg-violet-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-violet-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-violet-600/20">
                  Buat Pengingat
                </button>
              </div>
              
              {/* Efek glow latar belakang */}
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-violet-600/5 blur-3xl rounded-full" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bills;
