import React from "react";
import { Search, Bell, Menu, LayoutGrid } from "lucide-react";

interface HeaderProps {
  onMenuOpen: () => void;
  userRole?: "user" | "admin";
  setUserRole?: (role: "user" | "admin") => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuOpen, userRole }) => {
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
             />
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {userRole === 'admin' && (
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-600 font-black text-[10px] uppercase tracking-widest shadow-sm">
            <LayoutGrid size={12} />
            Admin Console
          </div>
        )}

        <button className="relative p-2.5 text-slate-500 hover:text-slate-900 transition-all bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 group">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
        </button>

        <div className="hidden lg:block h-8 w-[1px] bg-slate-100 mx-2" />
      </div>
    </header>
  );
};
