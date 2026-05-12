import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, ShieldCheck, PieChart, Wallet, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;
        
        onLogin({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.name || data.user.email,
          role: data.user.user_metadata.role || "user",
        });
      } else {
        const { data, error: registerError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              role: "user",
            },
          },
        });

        if (registerError) throw registerError;

        if (data.user) {
          await supabase.from('user_profiles').insert([
            {
              id: data.user.id,
              full_name: name,
              currency: 'IDR',
              created_at: new Date().toISOString()
            }
          ]);
        }

        setIsLogin(true);
        setError("Registrasi berhasil! Silakan periksa email Anda untuk verifikasi lalu masuk.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Silakan masukkan alamat email Anda terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#reset-password',
      });
      if (error) throw error;
      setError("Email instruksi pengaturan ulang kata sandi telah dikirim!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-[1000px] w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 flex overflow-hidden border border-slate-100">
        <div className="hidden lg:flex flex-1 bg-violet-600 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-400/20 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/20">
                <ShieldCheck className="text-violet-600 w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white">Monetra</span>
            </div>
            
            <h1 className="text-4xl font-black text-white leading-tight mb-6">
              Kelola kekayaan Anda <br /> dengan cerdas.
            </h1>
            <p className="text-violet-100 font-medium text-lg max-w-md">
              Aman, transparan, dan pemantauan finansial komprehensif untuk Anda.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <PieChart className="text-white w-8 h-8 mb-4" />
                <h3 className="text-white font-bold text-sm">Analisis Mendalam</h3>
                <p className="text-violet-200 text-[10px]">Laporan visual untuk transaksi.</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <Wallet className="text-white w-8 h-8 mb-4" />
                <h3 className="text-white font-bold text-sm">Anggaran Pintar</h3>
                <p className="text-violet-200 text-[10px]">Kontrol pengeluaran otomatis.</p>
             </div>
          </div>
        </div>

        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                {isLogin ? "Selamat Datang" : "Buat Akun"}
              </h2>
              <p className="text-slate-500 font-medium">
                {isLogin 
                  ? "Masuk untuk mengelola keuangan Anda." 
                  : "Mulai perjalanan finansial Anda hari ini."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="register-name"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                      Nama Lengkap
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={20} />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-600/20 focus:bg-white px-12 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900"
                        placeholder="Nama Lengkap Anda"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  Alamat Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-600/20 focus:bg-white px-12 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  Kata Sandi
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-600/20 focus:bg-white px-12 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isLogin && (
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-violet-600 transition-colors"
                    >
                      Lupa Kata Sandi?
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className={`p-4 rounded-xl text-sm font-bold ${error.includes("successful") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-violet-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar Akun"}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
                  <span className="px-4 bg-white text-slate-300">Atau lanjut dengan</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Lanjut dengan Google
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium">
                {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-violet-600 font-black hover:underline ml-1"
                >
                  {isLogin ? "Daftar sekarang" : "Masuk"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
