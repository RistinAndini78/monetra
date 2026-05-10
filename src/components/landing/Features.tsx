import React from "react";
import { 
  Wallet, 
  BarChart3, 
  TrendingUp, 
  PieChart,
  ArrowRight
} from "lucide-react";

export const Features: React.FC = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Fitur Utama Monetra</h2>
        <p className="mt-4 text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Kami menyediakan semua alat yang Anda butuhkan untuk mencapai kebebasan finansial dengan lebih cepat dan cerdas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-stretch">
        {/* Feature 1 */}
        <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
          <div className="w-14 h-14 bg-violet-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
             <Wallet className="text-violet-600" size={28} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Pelacakan Otomatis</h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-6">
            Sinkronisasi langsung dengan bank dan dompet digital Anda untuk pencatatan transaksi yang real-time dan akurat.
          </p>
          <a href="#" className="inline-flex items-center gap-2 text-sm font-black text-violet-600 hover:gap-3 transition-all">
            Pelajari Selengkapnya <ArrowRight size={16} />
          </a>
        </div>

        {/* Feature 2 - Violet variant */}
        <div className="bg-violet-600 p-10 rounded-[32px] text-white shadow-2xl shadow-violet-600/20 flex flex-col justify-between group">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
             <BarChart3 className="text-white" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Analisis Cerdas</h3>
            <p className="text-violet-100 opacity-90 font-medium leading-relaxed mb-8">
              Visualisasi data pengeluaran Anda dengan grafik yang mudah dipahami setiap bulannya.
            </p>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-violet-600 bg-slate-200" />
                  ))}
               </div>
               <span className="text-xs font-bold opacity-80">+10rb pengguna puas</span>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-start lg:flex-row lg:items-center gap-10">
          <div className="flex-1">
             <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8">
                <TrendingUp className="text-emerald-500" size={28} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Target Finansial</h3>
             <p className="text-slate-500 font-medium leading-relaxed">
               Tetapkan target menabung untuk impian Anda, mulai dari liburan hingga rumah pertama.
             </p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-start lg:flex-row lg:items-center lg:justify-between gap-10">
          <div className="flex-1">
             <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                <PieChart className="text-blue-500" size={28} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Manajemen Anggaran</h3>
             <p className="text-slate-500 font-medium leading-relaxed">
               Kelola budget bulanan per kategori untuk memastikan Anda tidak pernah melebihi batas pengeluaran.
             </p>
          </div>
          <div className="w-32 h-32 relative">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="50" 
                  fill="none" 
                  stroke="#7C3AED" 
                  strokeWidth="12" 
                  strokeDasharray="314" 
                  strokeDashoffset="100" 
                  strokeLinecap="round" 
                />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-slate-900">82%</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
