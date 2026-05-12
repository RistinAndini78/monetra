import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2,
  CreditCard,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  Edit2,
  Upload,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import FileService from "../lib/fileService";
import PushNotificationService from "../lib/notifications";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending';
  catatan?: string;
  proof_url?: string;
}

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('monetra_search_query') || '';
  });

  // Clear search query from storage after reading it
  useEffect(() => {
    localStorage.removeItem('monetra_search_query');
  }, []);
  const [dbTransactions, setDbTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTx, setNewTx] = useState({
    judul: '', catatan: '', recipient: '', category: 'Makanan', amount: '', type: 'expense' as any, date: new Date().toISOString().split('T')[0], proof_url: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const kategoriPemasukan = ['Gaji', 'Bonus', 'Investasi', 'Lainnya'];
  const kategoriPengeluaran = ['Makanan', 'Transport', 'Belanja', 'Kesehatan', 'Lainnya'];
  const currentKategori = newTx.type === 'income' ? kategoriPemasukan : kategoriPengeluaran;

  useEffect(() => {
    fetchTransactions();

    const handleGlobalSearch = (e: any) => {
      setSearchQuery(e.detail);
    };

    window.addEventListener('monetra-search', handleGlobalSearch);
    return () => window.removeEventListener('monetra-search', handleGlobalSearch);
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;

      let query = supabase.from('transactions').select('*');
      
      if (currentUserId) {
        query = query.eq('user_id', currentUserId);
      }

      const { data, error } = await query.order('date', { ascending: false });
      if (error) throw error;
      const mapped: Transaction[] = (data || []).map((tx: any) => ({
        id: tx.id, 
        name: tx.description || "Tanpa Judul", 
        category: tx.category, 
        date: tx.date, 
        amount: Number(tx.amount), 
        type: tx.type, 
        status: 'completed', 
        catatan: tx.catatan,
        proof_url: tx.proof_url
      }));
      setDbTransactions(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = dbTransactions.filter(tx => {
    const matchesFilter = filter === 'Semua' || (filter === 'Pengeluaran' && tx.type === 'expense') || (filter === 'Pemasukan' && tx.type === 'income');
    const matchesSearch = tx.name.toLowerCase().includes(searchQuery.toLowerCase()) || tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIncome = dbTransactions.filter(tx => tx.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = dbTransactions.filter(tx => tx.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      let proofUrl = newTx.proof_url;
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('transaction-proofs')
          .upload(filePath, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('transaction-proofs')
          .getPublicUrl(filePath);
        
        proofUrl = publicUrl;
      }

      const transactionData = {
        description: newTx.judul,
        amount: Number(newTx.amount),
        category: newTx.category,
        type: newTx.type,
        date: newTx.date,
        catatan: newTx.catatan,
        proof_url: proofUrl,
        user_id: userId
      };

      if (editingId) {
        // Update Transaksi Lama (Hapus user_id dari payload update agar tidak konflik)
        const { user_id, ...updateData } = transactionData;
        
        // Bersihkan data dari undefined/null jika ada
        Object.keys(updateData).forEach(key => (updateData as any)[key] === undefined && delete (updateData as any)[key]);

        const { error } = await supabase
          .from('transactions')
          .update(updateData)
          .eq('id', editingId);
          
        if (error) {
          console.error("Update Error:", error);
          throw new Error("Gagal memperbarui: " + error.message);
        }
        PushNotificationService.sendNotification("Berhasil", { body: "Transaksi telah diperbarui." });
      } else {
        // Tambah Transaksi Baru
        const { error } = await supabase
          .from('transactions')
          .insert([transactionData]);
        if (error) {
          console.error("Insert Error:", error);
          throw new Error("Gagal menyimpan: " + error.message);
        }
        PushNotificationService.sendNotification("Berhasil", { body: "Transaksi baru telah dicatat." });
      }

      setIsModalOpen(false);
      setEditingId(null);
      setNewTx({ judul: '', catatan: '', recipient: '', category: 'Makanan', amount: '', type: 'expense', date: new Date().toISOString().split('T')[0], proof_url: '' });
      setSelectedImage(null);
      setImagePreview(null);
      
      // Penting: fetch ulang segera setelah update sukses
      await fetchTransactions();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const currentUserId = userData?.user?.id;
    
    console.log("DEBUG DELETE:", {
      idToDelete: id,
      currentUserId: currentUserId
    });

    if (!id) {
      alert("Error: ID Transaksi tidak ditemukan!");
      return;
    }

    if (!window.confirm(`Hapus transaksi dengan ID: ${id}?\n\nJika ini data bawaan (mock), pastikan Anda pemilik data ini.`)) return;
    
    try {
      setIsSubmitting(true);
      const { error, count } = await supabase
        .from('transactions')
        .delete({ count: 'exact' })
        .eq('id', id);
        
      if (error) {
        console.error("Delete Error:", error);
        throw new Error(error.message);
      }
      
      console.log("Rows affected:", count);
      
      if (count === 0) {
        alert("Peringatan: Transaksi tidak ditemukan di database atau Anda tidak memiliki izin untuk menghapusnya (RLS).");
      } else {
        setDbTransactions(prev => prev.filter(t => t.id !== id));
        await fetchTransactions();
        PushNotificationService.sendNotification("Berhasil", { body: "Transaksi telah dihapus." });
      }
    } catch (err: any) {
      console.error("Full Delete Error:", err);
      alert("Gagal menghapus: " + (err.message || "Terjadi kesalahan pada server."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTransaction = (tx: Transaction) => {
    console.log("Editing transaction:", tx);
    setEditingId(tx.id);
    setNewTx({
      type: tx.type,
      amount: tx.amount.toString(),
      category: tx.category,
      judul: tx.name,
      catatan: tx.catatan || "",
      date: tx.date,
      recipient: '',
      proof_url: tx.proof_url || ''
    });
    setIsModalOpen(true);
  };

  const handleExportTransactions = () => {
    const exportData = filteredTransactions.map(tx => ({
      'Tanggal': tx.date,
      'Nama': tx.name,
      'Kategori': tx.category,
      'Tipe': tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      'Jumlah': tx.amount,
      'Catatan': tx.catatan || ''
    }));

    FileService.exportAsCSV(
      exportData,
      FileService.generateFilename('transactions_export', 'csv')
    );

    // Send notification
    PushNotificationService.sendNotification('📥 Export Berhasil', {
      body: `${exportData.length} transaksi telah diekspor ke CSV`
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const formatCurrencyLocal = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    
    // Header PDF
    doc.setFontSize(22);
    doc.setTextColor(124, 58, 237);
    doc.text("MONETRA", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Laporan Riwayat Transaksi", 105, 28, { align: "center" });
    
    doc.setDrawColor(241, 245, 249);
    doc.line(20, 35, 190, 35);

    // Ringkasan
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`Total Pemasukan: ${formatCurrencyLocal(totalIncome)}`, 20, 45);
    doc.text(`Total Pengeluaran: ${formatCurrencyLocal(totalExpense)}`, 20, 52);
    doc.text(`Sisa Saldo: ${formatCurrencyLocal(totalIncome - totalExpense)}`, 20, 59);

    // Tabel Transaksi
    const tableData = filteredTransactions.map(tx => [
      format(new Date(tx.date), "dd/MM/yyyy"),
      tx.name,
      tx.category,
      tx.type === 'income' ? 'Masuk' : 'Keluar',
      formatCurrencyLocal(tx.amount)
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Jumlah']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255] },
      styles: { fontSize: 9 }
    });

    doc.save(`Laporan_Monetra_Transaksi_${new Date().getTime()}.pdf`);
    
    PushNotificationService.sendNotification('📥 Export Berhasil', {
      body: `Laporan PDF telah berhasil diunduh.`
    });
  };

  const handleFileImport = async (file: File) => {
    try {
      // Validate file
      const validation = FileService.validateFile(file, {
        maxSize: 5 * 1024 * 1024,
        acceptedTypes: ['text/csv', 'application/json', 'image/jpeg', 'image/png', '.csv', '.json', '.jpg', '.png']
      });

      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      let importData: any[] = [];

      if (file.name.endsWith('.csv')) {
        importData = await FileService.parseCSV(file);
      } else if (file.name.endsWith('.json')) {
        const json = await FileService.parseJSON(file);
        importData = Array.isArray(json) ? json : [json];
      } else if (file.type.startsWith('image/')) {
        // Handle as image proof for a new transaction
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setIsModalOpen(true);
        return;
      } else {
        alert('Format file tidak didukung. Gunakan Gambar, CSV atau JSON.');
        return;
      }

      // Process imported data
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      let successCount = 0;
      for (const item of importData) {
        try {
          // Map imported data to transaction format
          const amount = parseFloat(item.jumlah || item.amount || item.Jumlah || item.Amount || 0);
          const description = item.nama || item.name || item.Nama || item.Name || 'Import';
          const category = item.kategori || item.category || item.Kategori || item.Category || 'Lainnya';
          const type = (item.tipe || item.type || item.Tipe || item.Type || 'expense').toLowerCase() === 'income' ? 'income' : 'expense';
          const date = item.tanggal || item.date || item.Tanggal || item.Date || new Date().toISOString().split('T')[0];

          const { error } = await supabase.from('transactions').insert([{
            description,
            category,
            amount,
            type,
            date,
            user_id: userId,
            catatan: item.catatan || item.notes || item.Catatan || null
          }]);

          if (!error) successCount++;
        } catch (err) {
          console.error('Error importing single transaction:', err);
        }
      }

      // Refresh transactions
      fetchTransactions();

      // Send notification
      PushNotificationService.sendNotification('✅ Import Berhasil', {
        body: `${successCount} dari ${importData.length} transaksi berhasil diimport`
      });

      alert(`Import berhasil! ${successCount} transaksi ditambahkan.`);
    } catch (err: any) {
      console.error('Import error:', err);
      alert('Gagal mengimport file: ' + err.message);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/10 backdrop-blur-[20px] z-[-1]" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl flex flex-col z-10 max-h-[90vh] overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{editingId ? "✏️ Edit Transaksi" : "✨ Transaksi Baru"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-xl"><X size={20} /></button>
              </div>
              <div className="overflow-y-auto p-8 custom-scrollbar">
                <form onSubmit={handleAddTransaction} className="space-y-6">
                <div className="p-1 bg-slate-100 rounded-2xl grid grid-cols-2 gap-1">
                  <button type="button" onClick={() => setNewTx({...newTx, type: 'income', category: 'Gaji'})} className={`py-3 rounded-xl font-bold text-xs transition-all ${newTx.type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Pemasukan</button>
                  <button type="button" onClick={() => setNewTx({...newTx, type: 'expense', category: 'Makanan'})} className={`py-3 rounded-xl font-bold text-xs transition-all ${newTx.type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Pengeluaran</button>
                </div>
                <div className="space-y-4">
                  <input type="text" required value={newTx.judul} onChange={(e) => setNewTx({...newTx, judul: e.target.value})} className="input-field w-full" placeholder="Nama Transaksi" />
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none z-10">
                      <span className="font-black text-violet-600 text-[10px]">Rp.</span>
                    </div>
                    <input 
                      type="number" 
                      required 
                      value={newTx.amount} 
                      onChange={(e) => setNewTx({...newTx, amount: e.target.value})} 
                      className="w-full pl-14 pr-8 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-violet-600 focus:ring-4 focus:ring-violet-600/5 transition-all font-black text-base text-slate-900" 
                      placeholder="0" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={newTx.category} onChange={(e) => setNewTx({...newTx, category: e.target.value})} className="input-field w-full text-sm font-bold">{currentKategori.map(k => <option key={k} value={k}>{k}</option>)}</select>
                    <input type="date" required value={newTx.date} onChange={(e) => setNewTx({...newTx, date: e.target.value})} className="input-field w-full text-sm font-bold" />
                  </div>
                  
                  {/* Image Upload Field - Only for Expense */}
                  {newTx.type === 'expense' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bukti Struk Pembayaran (Wajib/Opsional)</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDragOver(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file && file.type.startsWith('image/')) {
                            setSelectedImage(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className={`border-2 border-dashed rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden min-h-[180px] ${
                          isDragOver ? 'border-violet-600 bg-violet-50 scale-[1.02]' :
                          imagePreview 
                            ? 'border-emerald-500 bg-emerald-50/30' 
                            : 'border-slate-200 bg-slate-50 hover:border-violet-600 hover:bg-violet-50/50'
                        }`}
                      >
                        {imagePreview ? (
                          <div className="relative w-full">
                            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-[24px] shadow-lg" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-[24px]">
                              <p className="text-white text-xs font-bold">Klik untuk ganti foto</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-violet-600 transition-colors">
                              <Upload size={32} />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-black text-slate-900">Klik atau seret foto ke sini</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Format: PNG, JPG (Max 5MB)</p>
                            </div>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedImage(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 rounded-2xl shadow-xl shadow-violet-600/20">{isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Riwayat Transaksi <span className="text-[10px] text-slate-300 font-normal ml-2">v1.0.4</span></h2>
          <p className="text-slate-400 font-medium text-xs mt-1">Manajemen seluruh aktivitas keuangan Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all shadow-sm hover:text-slate-900" 
            title="Unduh riwayat sebagai PDF"
          >
            <FileText size={20} />
          </button>
          <button 
            onClick={handleExportTransactions}
            className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all shadow-sm hover:text-slate-900" 
            title="Unduh riwayat sebagai CSV"
          >
            <Download size={20} />
          </button>
          <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2 py-3"><Plus size={18} /> <span>Tambah</span></button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Masuk</p>
          <p className="text-xl font-black text-emerald-500 tabular-nums">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalIncome)}</p>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Keluar</p>
          <p className="text-xl font-black text-rose-500 tabular-nums">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalExpense)}</p>
        </div>
        <div className="bg-violet-600 p-6 rounded-[32px] shadow-lg shadow-violet-600/20 text-white">
          <p className="text-[10px] font-black text-violet-200 uppercase tracking-widest mb-1 text-center">Selisih Kas</p>
          <p className="text-xl font-black text-white tabular-nums text-center">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalIncome - totalExpense)}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-2 p-1 bg-slate-100 border border-slate-200 rounded-2xl w-fit">
          {["Semua", "Pengeluaran", "Pemasukan"].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${filter === tab ? "bg-white text-violet-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl skeleton" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 skeleton" />
                    <div className="h-3 w-20 skeleton" />
                  </div>
                </div>
                <div className="h-6 w-24 rounded-lg skeleton" />
              </div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300"><CreditCard size={40} /></div>
            <p className="text-slate-900 font-black text-lg">Kosong Melompong</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Jumlah</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                            {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{tx.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[10px] text-slate-400">{format(new Date(tx.date), "dd MMM yyyy")}</p>
                              {tx.proof_url && (
                                <a href={tx.proof_url} target="_blank" rel="noreferrer" className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                                  • Lihat Bukti
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">{tx.category}</span>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-sm tabular-nums">
                        <p className={tx.type === 'income' ? "text-emerald-500" : "text-slate-900"}>
                          {tx.type === 'income' ? "+" : "-"}{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(tx.amount)}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEditTransaction(tx); }} 
                            className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-violet-100 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteTransaction(tx.id); }} 
                            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-100 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden divide-y divide-slate-50">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="p-6 space-y-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                        {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{tx.name}</p>
                        <p className="text-[10px] text-slate-400">{format(new Date(tx.date), "dd MMM yyyy")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-sm tabular-nums ${tx.type === 'income' ? "text-emerald-500" : "text-slate-900"}`}>
                        {tx.type === 'income' ? "+" : "-"}{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(tx.amount)}
                      </p>
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[9px] font-black text-slate-400 uppercase tracking-widest">{tx.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50/50">
                    <div className="flex gap-2">
                      {tx.proof_url && (
                        <a href={tx.proof_url} target="_blank" rel="noreferrer" className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1 bg-violet-50 px-2 py-1 rounded-lg">
                          Bukti
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleEditTransaction(tx)} 
                        className="p-2 text-slate-400 hover:text-violet-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTransaction(tx.id)} 
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
