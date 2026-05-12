import React from "react";
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  PiggyBank, 
  BarChart3,
  Target, 
  Settings,
  ShieldCheck,
  Bell,
  FileText,
  Activity,
  X,
  LogOut,
  User,
  History,
  ShieldAlert,
  Globe,
  BellRing
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import femaleAvatar from "../assets/female.jpg";
import maleAvatar from "../assets/male.jpg";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: "user" | "admin";
  onLogout: () => void;
  userName?: string;
}

const userNavigation = [
  { group: "UTAMA", items: [
    { name: "Dashboard", id: "Dashboard", icon: LayoutDashboard },
    { name: "Transaksi", id: "Transactions", icon: CreditCard },
  ]},
  { group: "PERENCANAAN", items: [
    { name: "Budget", id: "Budgets", icon: PiggyBank },
  ]},
  { group: "ANALISIS", items: [
    { name: "Analytics", id: "Analysis", icon: BarChart3 },
  ]},
  { group: "PENGATURAN", items: [
    { name: "Notifikasi", id: "Notifications", icon: Bell },
    { name: "Profil & Settings", id: "Settings", icon: Settings },
  ]}
];

const adminNavigation = [
  { group: "OVERVIEW", items: [
    { name: "Admin Dashboard", id: "Monitoring", icon: LayoutDashboard },
    { name: "Kelola User", id: "Users", icon: ShieldCheck },
  ]},
  { group: "MONITORING", items: [
    { name: "Data Transaksi", id: "AdminTransactions", icon: Activity },
    { name: "Analytics Sistem", id: "Analysis", icon: Globe },
  ]},
  { group: "LAPORAN", items: [
    { name: "Laporan Keuangan", id: "Reports", icon: FileText },
    { name: "Notifikasi Sistem", id: "SystemNotif", icon: BellRing },
  ]}
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  onClose,
  userRole,
  onLogout,
  userName
}) => {
  const navigation = userRole === "user" ? userNavigation : adminNavigation;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

        <aside
          className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 flex flex-col z-[70] shadow-xl lg:shadow-none transition-transform duration-500 ease-in-out"
        >
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xl">M</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">Monetra</span>
            </div>
            <button onClick={onClose} className="p-2 lg:hidden text-slate-400 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="px-6 mb-6">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl flex items-center gap-3 group relative overflow-hidden transition-all hover:bg-slate-100/50">
              <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm shrink-0 z-10 bg-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-xl uppercase">
                  {userName?.charAt(0) || 'P'}
                </span>
              </div>
              <div className="overflow-hidden z-10">
                <p className="text-sm font-black text-slate-900 truncate">
                  {userName || 'Pengguna'}
                </p>
                {userRole === 'admin' && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                      Administrator
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          <div className="px-4 space-y-6">
            {navigation.map((group) => (
              <div key={group.group} className="space-y-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] px-4 mb-3">{group.group}</p>
                <nav className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                        activeTab === item.id
                          ? "text-white"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {activeTab === item.id && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute inset-0 bg-violet-600 shadow-lg shadow-violet-600/20 z-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <item.icon size={20} className={`z-10 transition-transform duration-300 group-hover:scale-110 ${activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                      <span className="z-10 font-bold text-sm tracking-wide">{item.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-50">
          <button 
            onClick={onLogout}
            className="flex items-center gap-4 px-6 py-3 text-rose-500 bg-rose-50 transition-all w-full font-bold text-sm group rounded-2xl hover:bg-rose-100/70 active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm transition-colors">
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>
    </>
  );
};
