import React from "react";

interface Transaction {
  name: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
}

const transactions: Transaction[] = [
  { name: "Coffee Shop", category: "Kebutuhan", amount: -45000, date: "Hari ini, 14:20", icon: "☕" },
  { name: "Gaji Bulanan", category: "Pemasukan", amount: 7500000, date: "Kemarin", icon: "💰" },
  { name: "Supermarket", category: "Belanja", amount: -850000, date: "12 Okt 2023", icon: "🛒" },
  { name: "Subscription", category: "Hiburan", amount: -159000, date: "11 Okt 2023", icon: "📺" },
];

export const RecentTransactions: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-lg text-slate-900">Transaksi Terakhir</h3>
        <button className="text-cyan-600 text-sm font-bold hover:text-cyan-700 transition-colors bg-cyan-50 px-3 py-1 rounded-lg">
          Lihat Semua
        </button>
      </div>
      <div className="space-y-6">
        {transactions.map((item, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer pb-4 border-b border-slate-50 last:border-0 last:pb-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-slate-100 transition-all border border-slate-100">
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 group-hover:text-cyan-600 transition-colors">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                </div>
              </div>
            </div>
            <p className={`font-bold text-sm ${item.amount > 0 ? "text-emerald-500" : "text-slate-900"}`}>
              {item.amount > 0 ? "+" : ""}{item.amount.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
