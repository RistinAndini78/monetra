import React from "react";
import { Bell } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 px-6 sm:px-12 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-[2px]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-violet-600">Monetra</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          {[
            { name: "Beranda", id: "dashboard" },
            { name: "Transaksi", id: "transactions" },
            { name: "Anggaran", id: "budgets" },
            { name: "Target", id: "goals" }
          ].map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              className={`text-sm font-bold transition-colors ${item.id === "dashboard" ? "text-violet-600" : "text-slate-400 hover:text-slate-900"}`}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <Bell size={20} />
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-violet-600 bg-slate-100 overflow-hidden cursor-pointer hover:scale-105 transition-transform">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            alt="User" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};
