import React, { useState, useRef, useEffect } from "react";
import { 
  User, 
  Camera, 
  Mail,
  Phone,
  MapPin,
  Upload,
  MoreHorizontal,
  Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=7C3AED&color=fff&name=";
import { supabase } from "../lib/supabase";

interface SettingsProps {
  userName?: string;
  userEmail?: string;
  onUserUpdate?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ userName = "User", userEmail = "user@monetra.id", onUserUpdate }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: userName
  });

  useEffect(() => {
    const loadMetadata = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata) {
        setFormData({
          name: user.user_metadata.name || userName
        });
        if (user.user_metadata.avatar_url) {
          setProfileImage(user.user_metadata.avatar_url);
        }
      }
    };
    loadMetadata();
  }, [userName]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 400, height: 400 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Gagal akses kamera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan izin telah diberikan.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, 400, 400);
    
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
      stopCamera();
      await uploadFile(file);
    }, 'image/jpeg', 0.9);
  };

  const uploadFile = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);

    try {
      setIsUploadingPhoto(true);
      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('transaction-proofs')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('transaction-proofs')
        .getPublicUrl(filePath);
      
      const finalUrl = `${publicUrl}?t=${new Date().getTime()}`;

      await supabase.auth.updateUser({ data: { avatar_url: finalUrl } });
      setProfileImage(finalUrl);
      onUserUpdate?.();
    } catch (err: any) {
      console.error('Upload gagal:', err);
      alert('Gagal upload foto: ' + err.message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadFile(file);
    }
  };

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pengaturan Akun</h2>
          <p className="text-slate-400 font-medium">Kelola informasi profil dan foto Anda.</p>
        </div>
      </header>

      <div className="max-w-4xl space-y-10">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[40px] overflow-hidden border-4 border-[#F8F9FF] shadow-2xl relative bg-violet-600">
                <img 
                  src={profileImage || (DEFAULT_AVATAR + (formData.name || "User"))} 
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div 
                  onClick={handleUploadClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-[24px] p-6 flex flex-col items-center justify-center group cursor-pointer transition-all flex-1 ${
                    isDragging ? 'border-violet-600 bg-violet-600/10 scale-[1.02]' : 'border-slate-100 hover:border-violet-600/40 hover:bg-violet-600/5'
                  }`}
                >
                  {isUploadingPhoto ? (
                    <>
                      <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="text-xs font-black text-violet-600 tracking-widest uppercase text-center">Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <Upload className={`mb-2 transition-colors ${isDragging ? 'text-violet-600' : 'text-slate-300 group-hover:text-violet-600'}`} size={24} />
                      <span className={`text-xs font-black tracking-widest uppercase text-center transition-colors ${isDragging ? 'text-violet-600' : 'text-slate-400 group-hover:text-violet-600'}`}>Pilih / Seret Galeri</span>
                    </>
                  )}
                </div>
                <div 
                  onClick={startCamera}
                  className="border-2 border-dashed border-slate-100 rounded-[24px] p-6 flex flex-col items-center justify-center group cursor-pointer hover:border-emerald-600/40 hover:bg-emerald-600/5 transition-all flex-1"
                >
                  <Camera className="text-slate-300 mb-2 group-hover:text-emerald-600" size={24} />
                  <span className="text-xs font-black text-slate-400 group-hover:text-emerald-600 tracking-widest uppercase text-center">Ambil Foto</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-[#F8F9FB] border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-600/20 transition-all font-semibold"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 transition-colors">
                  <User size={14} />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Alamat Email</label>
              <div className="relative group">
                <input 
                  type="text" 
                  readOnly
                  value={userEmail}
                  className="w-full px-6 py-4 bg-[#F8F9FB] border-none rounded-2xl outline-none opacity-60 cursor-not-allowed font-semibold"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <Mail size={14} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-10">
            <button 
              disabled={isSaving}
              onClick={async () => {
                try {
                  setIsSaving(true);
                  const { error } = await supabase.auth.updateUser({
                    data: { 
                      name: formData.name
                    }
                  });
                  if (error) throw error;
                  alert("Profil berhasil diperbarui!");
                  onUserUpdate?.();
                } catch (err: any) {
                  alert("Gagal update: " + err.message);
                } finally {
                  setIsSaving(false);
                }
              }}
              className="bg-violet-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-violet-600/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={stopCamera}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] overflow-hidden w-full max-w-md relative z-10 shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-xl font-black text-slate-900">Ambil Foto Profil</h3>
                 <button onClick={stopCamera} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                    <MoreHorizontal size={20} />
                 </button>
              </div>
              
              <div className="p-8 bg-slate-900 aspect-square relative">
                 <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   muted
                   className="w-full h-full object-cover rounded-3xl"
                 />
                 <canvas ref={canvasRef} width="400" height="400" className="hidden" />
              </div>
              
              <div className="p-8 flex items-center justify-center gap-6">
                 <button 
                   onClick={stopCamera}
                   className="px-8 py-4 rounded-2xl text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                 >
                   Batal
                 </button>
                 <button 
                   onClick={capturePhoto}
                   className="bg-violet-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-violet-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                 >
                   <Camera size={18} />
                   <span>Ambil Foto</span>
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
