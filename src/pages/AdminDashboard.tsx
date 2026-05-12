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
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-violet-600" size={16} />
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.3em]">Administrator Monetra</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Kelola Pengguna</h2>
          <p className="text-slate-400 font-medium mt-1">Pantau dan kelola seluruh akses pengguna di dalam ekosistem Monetra.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none w-80 focus:ring-4 ring-violet-50 focus:border-violet-200 transition-all shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
           <h3 className="text-xl font-black text-slate-900">Database Pengguna <span className="text-violet-600 ml-2">({filteredUsers.length})</span></h3>
           <button 
             onClick={fetchUsers}
             className="p-3 bg-slate-50 text-slate-400 hover:text-violet-600 rounded-xl transition-all active:scale-90"
           >
             <Activity size={20} />
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengguna</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User ID</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mata Uang</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Gabung</th>
                <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-sm">Menyelaraskan data...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Users className="text-slate-200 mx-auto mb-4" size={64} />
                    <p className="text-slate-400 font-bold text-lg">Belum ada user yang terhubung</p>
                    <p className="text-slate-300 text-sm mt-1 max-w-xs mx-auto">Pastikan Anda sudah menjalankan SQL Trigger di Supabase agar user otomatis muncul di sini.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-violet-600/20">
                          {user.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{user.full_name || "User Baru"}</p>
                          <p className="text-xs text-slate-400 font-medium">Pengguna Aktif</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <code className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{user.id.substring(0, 12)}...</code>
                    </td>
                    <td className="py-6 px-6 font-bold text-sm text-slate-600">{user.currency || 'IDR'}</td>
                    <td className="py-6 px-6 text-xs font-bold text-slate-400">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="py-6 px-10 text-right">
                       <button className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                         Blokir
                       </button>
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

export default AdminDashboard;
