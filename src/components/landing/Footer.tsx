import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="px-6 py-20 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-[2px]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-violet-600">Monetra</span>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Solusi finansial cerdas untuk masa depan yang lebih mapan dan terencana.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-12 lg:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Informasi</h4>
            <a href="#" className="text-sm text-slate-400 font-bold hover:text-violet-600 transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-sm text-slate-400 font-bold hover:text-violet-600 transition-colors">Syarat & Ketentuan</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Dukungan</h4>
            <a href="#" className="text-sm text-slate-400 font-bold hover:text-violet-600 transition-colors">Pusat Bantuan</a>
            <a href="#" className="text-sm text-slate-400 font-bold hover:text-violet-600 transition-colors">Status API</a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-50 text-center">
        <p className="text-xs text-slate-300 font-bold">
          © 2024 Monetra Financial. Hak cipta dilindungi undang-undang.
        </p>
      </div>
    </footer>
  );
};
