import React, { useState, useRef } from "react";
import { 
  User, 
  Lock, 
  CreditCard, 
  Bell, 
  Link as LinkIcon, 
  Camera, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Upload,
  Plus,
  MoreHorizontal,
  Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import femaleAvatar from "../assets/female.jpg";
import maleAvatar from "../assets/male.jpg";
import { supabase } from "../lib/supabase";

interface SettingsProps {
  userName?: string;
  userEmail?: string;
}

const Settings: React.FC<SettingsProps> = ({ userName = "User", userEmail = "user@monetra.id" }) => {
  const [activeSubTab, setActiveSubTab] = useState("Informasi Pribadi");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { name: "Informasi Pribadi", icon: <User size={18} /> },
    { name: "Keamanan & Privasi", icon: <Lock size={18} /> },
  ];

  const renderSubContent = () => {
    switch (activeSubTab) {
      case "Informasi Pribadi":
        return (
          <div className="space-y-10">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-[40px] overflow-hidden border-4 border-[#F8F9FF] shadow-2xl relative bg-violet-600">
                    <img 
                      src={profileImage || (
                        (userName?.toLowerCase().match(/(i|a)$/) || userName?.toLowerCase().match(/(putri|sari|ayu|dewi|andini|rina|maya|fitri|lestari|indah|amalia)/)) 
                        ? femaleAvatar 
                        : maleAvatar
                      )} 
                      alt="Profil" 
                      className="w-full h-full object-cover bg-slate-900 shadow-inner group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <Camera className="text-white" size={32} />
                    </div>
                  </div>
                  <button 
                    onClick={handleUploadClick}
                    className="absolute -bottom-2 -right-2 bg-violet-600 text-white p-3 rounded-2xl shadow-xl shadow-violet-600/40 hover:scale-110 active:scale-95 transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Foto Profil</h3>
                  <p className="text-slate-400 font-medium leading-relaxed mb-6">Ukuran disarankan: 400x400px. JPG atau PNG.</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <div 
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-slate-100 rounded-[24px] p-8 flex flex-col items-center justify-center group cursor-pointer hover:border-violet-600/40 hover:bg-violet-600/5 transition-all"
                  >
                    <Upload className="text-slate-300 mb-2 group-hover:text-violet-600" size={24} />
                    <span className="text-xs font-black text-slate-400 group-hover:text-violet-600 tracking-widest uppercase">Klik atau seret untuk mengunggah foto baru</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Informasi Pribadi</h3>
                  <div className="bg-violet-600/5 px-4 py-2 rounded-xl flex items-center gap-2">
                     <CheckCircle2 className="text-violet-600" size={14} />
                     <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Status Premium</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Nama Lengkap", value: userName, icon: <User size={14} /> },
                    { label: "Alamat Email", value: userEmail, icon: <Mail size={14} /> },
                    { label: "Nomor Telepon", value: "+62 812-3456-7890", icon: <Phone size={14} /> },
                    { label: "Lokasi", value: "Jakarta, Indonesia", icon: <MapPin size={14} /> },
                  ].map(field => (
                    <div key={field.label} className="space-y-3">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                       <div className="relative group">
                          <input 
                            type="text" 
                            defaultValue={field.value}
                            className="w-full px-6 py-4 bg-[#F8F9FB] border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                             {field.icon}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

                <div className="mt-10 space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Bio</label>
                  <textarea 
                    className="w-full px-6 py-4 bg-[#F8F9FB] border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold h-32 resize-none"
                    placeholder="Ceritakan tentang diri Anda..."
                    defaultValue="Mengelola portofolio kekayaan yang terdiversifikasi dengan fokus pada keberlanjutan dan pertumbuhan jangka panjang."
                  />
               </div>

                <div className="flex justify-end gap-4 pt-10">
                   <button 
                    type="button"
                    className="px-8 py-4 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                   >
                    Batalkan
                   </button>
                   <button 
                    onClick={async () => {
                      const newName = (document.querySelector('input[defaultValue="' + userName + '"]') as HTMLInputElement)?.value;
                      const { error } = await supabase.auth.updateUser({
                        data: { name: newName || userName }
                      });
                      if (error) alert("Gagal update: " + error.message);
                      else alert("Profil berhasil diperbarui! Silakan refresh halaman.");
                    }}
                    className="bg-violet-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-violet-600/40 hover:scale-105 active:scale-95 transition-all"
                   >
                    Simpan Perubahan
                   </button>
                </div>
            </div>
          </div>
        );
      case "Keamanan & Privasi":
        return (
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-10">Pengaturan Keamanan</h3>
            <div className="space-y-8">
               {[
                 { title: "Autentikasi Dua Faktor", desc: "Tambahkan lapisan keamanan ekstra ke akun Anda.", status: "Aktif", type: "toggle" },
                 { title: "Mode Privasi", desc: "Sembunyikan saldo dan detail transaksi di dasbor Anda.", status: "Nonaktif", type: "toggle" },
                 { title: "Notifikasi Email", desc: "Kirim pengingat tagihan dan konfirmasi pembayaran ke email Anda.", status: "Aktif", type: "toggle" },
                 { title: "Manajemen Sesi", desc: "Pantau di mana Anda telah masuk.", status: "Aktif", type: "button" },
               ].map(item => (
                 <div key={item.title} className="flex items-center justify-between p-6 bg-[#F8F9FB] rounded-3xl group">
                    <div>
                       <h4 className="text-base font-black text-slate-900">{item.title}</h4>
                       <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{item.desc}</p>
                    </div>
                    {item.type === 'toggle' ? (
                      <div className={`w-14 h-8 ${item.status === 'Aktif' ? 'bg-violet-600' : 'bg-slate-200'} rounded-full p-1 relative cursor-pointer`}>
                         <div className={`w-6 h-6 bg-white rounded-full shadow-md ${item.status === 'Aktif' ? 'translate-x-6' : 'translate-x-0'} transition-transform`} />
                      </div>
                    ) : (
                      <button className="text-violet-600 font-black text-[10px] uppercase tracking-widest hover:underline">Kelola</button>
                    )}
                 </div>
               ))}
               
               <div className="pt-10 space-y-6">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Kekuatan Kata Sandi</h4>
                  <div className="flex gap-2">
                     <div className="h-2 flex-1 bg-violet-600 rounded-full" />
                     <div className="h-2 flex-1 bg-violet-600 rounded-full" />
                     <div className="h-2 flex-1 bg-violet-600 rounded-full" />
                     <div className="h-2 flex-1 bg-slate-100 rounded-full" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Terakhir diubah: baru saja</p>
                  <button 
                    onClick={async () => {
                      const { error } = await supabase.auth.resetPasswordForEmail(userEmail || '');
                      if (error) alert("Gagal: " + error.message);
                      else alert("Link reset password telah dikirim ke email Anda!");
                    }}
                    className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs hover:bg-slate-800 transition-all uppercase tracking-widest"
                  >
                    Ubah Kata Sandi
                  </button>
               </div>
            </div>
          </div>
        );


    }
  };

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pengaturan Akun</h2>
          <p className="text-slate-400 font-medium">Kelola informasi profil dan preferensi akun Anda.</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Navigasi Sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white p-4 rounded-[40px] border border-slate-100 shadow-sm space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveSubTab(item.name)}
                className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] text-sm font-black transition-all ${
                  activeSubTab === item.name
                    ? "bg-[#F8F9FF] text-violet-600"
                    : "text-slate-400 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {activeSubTab === item.name && <motion.div layoutId="settingActive" className="w-1.5 h-1.5 bg-violet-600 rounded-full" />}
              </button>
            ))}
          </div>
          
          <div className="mt-8 bg-rose-50/50 p-8 rounded-[40px] border border-rose-100 text-center">
             <h4 className="text-sm font-black text-rose-500 uppercase tracking-widest mb-4">Zona Bahaya</h4>
             <button className="text-[10px] font-black text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-widest hover:underline">
               Hapus Akun
             </button>
          </div>
        </div>

        {/* Area Konten */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSubContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const EditIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    <path d="m15 5 4 4"/>
  </svg>
);

export default Settings;
