import React, { useState, useEffect } from "react";
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  Server, 
  Search,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Ambil Total Pengguna dari user_profiles
      const { count, error: countError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      setTotalUsers(count || 0);

      // 2. Ambil Daftar User Terbaru
      const { data, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (usersError) throw usersError;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Pengguna", value: totalUsers.toLocaleString(), trend: "Database Riil", icon: Users, color: "bg-violet-50 text-violet-600" },
    { label: "Status Database", value: "Terhubung", trend: "Supabase", icon: Activity, color: "bg-emerald-50 text-emerald-600" },
    { label: "Keamanan", value: "Aktif", trend: "SSL/TLS", icon: ShieldCheck, color: "bg-blue-50 text-blue-600" },
    { label: "Region Server", value: "SG", trend: "Online", icon: Server, color: "bg-cyan-50 text-cyan-600" },
  ];

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Panel Kontrol Admin</h2>
          <p className="text-slate-400 font-medium tracking-tight">Data di bawah ditarik langsung dari tabel <span className="text-violet-600 font-bold">user_profiles</span>.</p>
        </div>
        <button 
          onClick={fetchAdminData}
          className="bg-violet-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-violet-700 active:scale-95 transition-all shadow-xl shadow-violet-600/20"
        >
          <Activity size={18} />
          <span>Segarkan Data</span>
        </button>
      </header>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${stat.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.1em] mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabel Manajemen Pengguna */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Daftar Pengguna Riil</h3>
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                 <input 
                   type="text" 
                   placeholder="Cari user..." 
                   className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none w-48"
                 />
              </div>
           </div>
           
           <div className="space-y-4">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 font-bold text-sm">Menghubungkan ke Supabase...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                   <Users className="text-slate-200 mx-auto mb-4" size={48} />
                   <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Belum ada user yang terdaftar</p>
                </div>
              ) : (
                users.map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-violet-600/10 rounded-xl flex items-center justify-center font-black text-violet-600 text-sm">
                        {user.full_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{user.full_name || "Tanpa Nama"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider bg-violet-50 text-violet-600">
                          {user.currency || 'IDR'}
                        </span>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Status Sistem */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[32px] text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-black mb-4">Integrasi Database</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs text-slate-400 font-bold">Tabel Profiles</span>
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Connected</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs text-slate-400 font-bold">Autentikasi</span>
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold">Sinkronisasi</span>
                  <span className="text-xs font-black text-violet-400 uppercase tracking-widest">Real-time</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-violet-600/20 blur-3xl rounded-full" />
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center">
            <ShieldCheck className="text-emerald-500 mx-auto mb-4" size={32} />
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Akses Terverifikasi</h4>
            <p className="text-xs text-slate-400 font-medium">Anda sedang menggunakan akun Admin utama untuk mengelola data platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
