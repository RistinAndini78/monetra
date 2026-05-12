import React from "react";
import { 
  FileText, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  Filter,
  Search,
  ExternalLink,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { supabase } from "../lib/supabase";

const Reports: React.FC = () => {
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [categoryStats, setCategoryStats] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState(() => {
    return localStorage.getItem('monetra_search_query') || '';
  });

  React.useEffect(() => {
    localStorage.removeItem('monetra_search_query');
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  React.useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const { data: txData, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // 1. Process Chart Data (Last 6 Months)
      const months: any = {};
      const last6Months = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return format(d, 'yyyy-MM');
      });

      last6Months.forEach(m => months[m] = { name: format(new Date(m), 'MMM'), income: 0, expenses: 0 });

      txData?.forEach(tx => {
        const monthKey = tx.date.substring(0, 7);
        if (months[monthKey]) {
          if (tx.type === 'income') months[monthKey].income += Number(tx.amount);
          else months[monthKey].expenses += Number(tx.amount);
        }
      });

      setChartData(Object.values(months));

      // 2. Process Transactions List
      setTransactions(txData || []);

      // 3. Process Category Stats
      const categories: any = {};
      let totalExp = 0;
      txData?.filter(tx => tx.type === 'expense').forEach(tx => {
        categories[tx.category] = (categories[tx.category] || 0) + Number(tx.amount);
        totalExp += Number(tx.amount);
      });

      const processedCats = Object.keys(categories).map(cat => ({
        name: cat,
        val: totalExp > 0 ? Math.round((categories[cat] / totalExp) * 100) : 0,
        color: cat === 'Makanan' ? 'bg-orange-500' : (cat === 'Transport' ? 'bg-sky-400' : 'bg-violet-600')
      })).sort((a, b) => b.val - a.val).slice(0, 3);

      setCategoryStats(processedCats);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Laporan Keuangan Monetra", 14, 22);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${format(new Date(), "dd MMMM yyyy HH:mm")}`, 14, 30);

    const tableData = transactions.map(tx => [
      tx.date,
      tx.description || "Tanpa Judul",
      tx.category,
      tx.type === 'income' ? 'Masuk' : 'Keluar',
      formatCurrency(tx.amount)
    ]);

    autoTable(doc, {
      head: [['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Jumlah']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: { fillGray: 200, textColor: 20, fontStyle: 'bold' }
    });

    doc.save(`Monetra_Report_${format(new Date(), "yyyyMMdd")}.pdf`);
  };

  const handleExportCSV = () => {
    const headers = ["Tanggal", "Keterangan", "Kategori", "Tipe", "Jumlah"];
    const rows = transactions.map(tx => [
      tx.date,
      tx.description || "Tanpa Judul",
      tx.category,
      tx.type,
      tx.amount
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Monetra_Report_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="p-10 flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-violet-600" size={40} />
    </div>
  );

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto w-full pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analisis / </span>
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Laporan Keuangan</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Laporan Keuangan</h2>
          <p className="text-slate-400 font-medium mt-1">Wawasan komprehensif tentang arus kas, investasi, dan pola belanja Anda.</p>
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 self-start">
           {["Mingguan", "Bulanan", "Tahunan"].map((period) => (
             <button 
               key={period}
               className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${period === 'Bulanan' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-slate-400 hover:text-slate-900'}`}
             >
               {period}
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kartu Grafik Utama */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Pendapatan vs. Pengeluaran</h3>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">Perbandingan bulanan untuk Oktober 2024</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendapatan</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengeluaran</span>
               </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      padding: '12px 16px'
                    }} 
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Area type="monotone" dataKey="income" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expenses" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-center">
                <p className="text-sm font-bold text-slate-900">Belum ada data grafik</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Lakukan transaksi untuk melihat grafik keuangan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Kartu Ekspor */}
        <div className="lg:col-span-4 bg-violet-600 rounded-[40px] p-10 flex flex-col justify-between text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black tracking-tight mb-4">Ekspor Data</h3>
            <p className="text-violet-200 text-sm font-medium leading-relaxed opacity-80">
              Hasilkan laporan berkualitas tinggi untuk catatan Anda atau akuntan.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
             <button 
               onClick={handleExportPDF}
               className="w-full bg-white text-violet-600 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-violet-600/20"
             >
                <FileText size={18} />
                Ekspor ke PDF
             </button>
             <button 
               onClick={handleExportCSV}
               className="w-full bg-white/10 text-white border border-white/10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
             >
                <Download size={18} />
                Ekspor ke Excel
             </button>
          </div>

          <div className="relative z-10 mt-10 pt-10 border-t border-white/10 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-200 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Terakhir dibuat: Hari ini, 09:42 WIB</span>
             </div>
             <button className="text-white/40 hover:text-white transition-colors">
                <TrendingUp size={16} />
             </button>
          </div>

          {/* Elemen Dekoratif */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h3 className="text-xl font-black text-slate-900">Rincian Transaksi</h3>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari transaksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border-none rounded-xl py-3 pl-12 pr-6 text-sm font-semibold outline-none focus:ring-2 focus:ring-violet-600/10 w-full md:w-64"
                />
             </div>
             <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors border border-slate-100">
                <Filter size={18} />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                {["Tanggal", "Deskripsi", "Kategori", "Metode", "Jumlah", "Status"].map(head => (
                  <th key={head} className="pb-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.filter(tx => 
                (tx.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tx.category || "").toLowerCase().includes(searchQuery.toLowerCase())
              ).length > 0 ? transactions.filter(tx => 
                (tx.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tx.category || "").toLowerCase().includes(searchQuery.toLowerCase())
              ).slice(0, 10).map((tx) => (
                <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 text-sm font-bold text-slate-600">{tx.date}</td>
                  <td className="py-6">
                    <p className="text-sm font-black text-slate-900">{tx.description || "Tanpa Judul"}</p>
                  </td>
                  <td className="py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      tx.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-violet-600/5 text-violet-600'
                    }`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-6 text-xs font-bold text-slate-400 uppercase tracking-wider">{tx.type}</td>
                  <td className={`py-6 text-sm font-black ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {tx.type === 'income' ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selesai</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                     <p className="text-sm font-bold text-slate-900">Belum ada rincian</p>
                     <p className="text-xs text-slate-400 font-medium mt-1">Data rincian Anda kosong.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-10 pt-10 border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Menampilkan 1-10 dari 128 transaksi</p>
           <div className="flex gap-2">
              <button className="px-6 py-2 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-all">Sebelumnya</button>
              <button className="px-6 py-2 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-600/20 transform hover:scale-105 transition-all">Berikutnya</button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
         {/* Kartu Kategori */}
         <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
               <h3 className="text-xl font-black text-slate-900 mb-8">Kategori Teratas</h3>
                <div className="space-y-6">
                  {categoryStats.map(cat => (
                    <div key={cat.name} className="space-y-2">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-900">{cat.name}</span>
                          <span className="text-[10px] font-bold text-slate-400">{cat.val}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${cat.val}%` }}
                            className={`h-full ${cat.color} rounded-full`}
                          />
                       </div>
                    </div>
                  ))}
                </div>
            </div>
            <button className="flex items-center justify-center gap-2 text-[10px] font-black text-violet-600 uppercase tracking-[0.2em] mt-10 hover:underline">
               Jelajahi Rincian Lengkap <ArrowUpRight size={14} />
            </button>
         </div>

         {/* Kartu Lokasi */}
         <div className="lg:col-span-8 bg-[#F8F9FA] p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="relative z-10">
               <h3 className="text-xl font-black text-slate-900 mb-2">Pengeluaran Berdasarkan Lokasi</h3>
               <p className="text-xs font-medium text-slate-400 max-w-xs">Distribusi geografis aktivitas perdagangan Anda.</p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-4 mt-8">
               {[
                 { loc: "Jakarta, ID", amount: "Rp42.100.000", color: "bg-violet-600" },
                 { loc: "Bandung, ID", amount: "Rp15.804.000", color: "bg-sky-400" },
                 { loc: "Surabaya, ID", amount: "Rp8.401.500", color: "bg-slate-900" },
               ].map(spot => (
                 <div key={spot.loc} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer">
                    <div className={`w-2.5 h-2.5 rounded-full ${spot.color}`} />
                    <div>
                       <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">{spot.loc}</p>
                       <p className="text-sm font-black text-slate-900">{spot.amount}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none grayscale">
               <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" alt="Map" className="w-[80%] object-contain" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Reports;
