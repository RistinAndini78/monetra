import React, { useState, useEffect } from "react";
import { Search, Bell, Menu, LayoutGrid, Check, Clock, Trash2, Loader2, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface HeaderProps {
  onMenuOpen: () => void;
  userRole?: "user" | "admin";
  setActiveTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuOpen, userRole, setActiveTab }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();

    // Subscribe to real-time notifications
    const channel = supabase
      .channel('realtime-notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications' 
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
        // Optional: Play a sound
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id?: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (id) {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      } else {
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
      }
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await supabase.from('notifications').delete().eq('id', id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40 border-b border-slate-100">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onMenuOpen}
          className="p-2.5 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all lg:hidden shrink-0 group"
        >
          <Menu size={22} className="group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex items-center gap-4 max-w-xl w-full">
           <div className="relative w-full hidden sm:block group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="Cari transaksi, budget, atau laporan..." 
               className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 focus:bg-white outline-none text-sm transition-all text-slate-900 placeholder-slate-400"
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && setActiveTab) {
                   const query = (e.target as HTMLInputElement).value;
                   localStorage.setItem('monetra_search_query', query);
                   setActiveTab('Transactions');
                   window.dispatchEvent(new CustomEvent('monetra-search', { detail: query }));
                 }
               }}
             />
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 relative">
        {userRole === 'admin' && (
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-600 font-black text-[10px] uppercase tracking-widest shadow-sm">
            <LayoutGrid size={12} />
            Admin Console
          </div>
        )}

        {/* NOTIFICATION BELL & DROPDOWN */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 transition-all border rounded-xl group ${isNotifOpen ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-600/20' : 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
          >
            <Bell size={20} className={`${unreadCount > 0 && !isNotifOpen ? 'animate-bounce' : ''} group-hover:rotate-12 transition-transform`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <>
                <div 
                  className="fixed inset-0 z-0" 
                  onClick={() => setIsNotifOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 sm:w-96 bg-white border border-slate-100 rounded-[32px] shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Notifikasi</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aktivitas Terbaru</p>
                    </div>
                    <button 
                      onClick={() => markAsRead()}
                      className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline"
                    >
                      Baca Semua
                    </button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                    {loading && notifications.length === 0 ? (
                      <div className="p-10 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-slate-300" />
                        <p className="text-xs font-bold text-slate-400">Memuat pesan...</p>
                      </div>
                    ) : notifications.length > 0 ? (
                      <div className="divide-y divide-slate-50">
                        {notifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={`p-5 flex gap-4 transition-colors hover:bg-slate-50 relative group ${!n.is_read ? 'bg-violet-50/30' : ''}`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.is_read ? 'bg-white shadow-sm text-violet-600' : 'bg-slate-100 text-slate-400'}`}>
                              {n.type === 'success' ? <Sparkles size={18} /> : <Bell size={18} />}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-start justify-between">
                                <p className={`text-xs font-black leading-tight ${!n.is_read ? 'text-slate-900' : 'text-slate-500'}`}>
                                  {n.title}
                                </p>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                  className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <p className="text-xs text-slate-400 font-medium line-clamp-2">{n.message}</p>
                              <div className="flex items-center gap-1.5 pt-1">
                                <Clock size={10} className="text-slate-300" />
                                <span className="text-[10px] font-bold text-slate-300">
                                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: id })}
                                </span>
                              </div>
                            </div>
                            {!n.is_read && (
                              <button 
                                onClick={() => markAsRead(n.id)}
                                className="absolute right-5 bottom-5 w-6 h-6 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-sm"
                                title="Tandai telah dibaca"
                              >
                                <Check size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                          <Bell size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-400">Belum ada notifikasi baru</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50/50 text-center">
                    <button 
                      onClick={() => {
                        setIsNotifOpen(false);
                        if (setActiveTab) setActiveTab('Notifications');
                      }}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                    >
                      Lihat Semua Aktivitas
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:block h-8 w-[1px] bg-slate-100 mx-2" />
      </div>
    </header>
  );
};

