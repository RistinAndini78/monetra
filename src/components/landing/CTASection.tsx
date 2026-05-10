import React from "react";

export const CTASection: React.FC = () => {
  return (
    <section className="px-6 py-20 pb-32">
      <div className="max-w-6xl mx-auto bg-slate-100/80 rounded-[56px] border border-slate-200/50 p-20 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight tracking-tight">
            Siap Mengambil Kendali <br /> Keuangan Anda?
          </h2>
          <p className="mt-8 text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Bergabunglah dengan ribuan pengguna lain yang telah berhasil mengatur keuangan mereka dengan Monetra. Gratis untuk 30 hari pertama.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button className="bg-violet-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-violet-600/20">
              Daftar Sekarang
            </button>
            <button className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all">
              Hubungi Sales
            </button>
          </div>
        </div>
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/5 blur-3xl opacity-50" />
      </div>
    </section>
  );
};
