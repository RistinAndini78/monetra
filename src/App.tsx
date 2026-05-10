import React, { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Analysis from "./pages/Analysis";
import Bills from "./pages/Bills";
import Reports from "./pages/Reports";
import Monitoring from "./pages/Monitoring";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSecurity from "./pages/AdminSecurity";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";

import { supabase } from "./lib/supabase";

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin">("admin");
  
  useEffect(() => {
    // Check for OAuth errors in URL
    const query = new URLSearchParams(window.location.search);
    if (query.get('error')) {
      alert(`Gagal Login: ${query.get('error_description') || 'State tidak valid'}`);
      window.history.replaceState({}, document.title, "/");
    }

    // Check for active admin session in localStorage
    const adminSession = localStorage.getItem("monetra_admin_session");
    if (adminSession) {
      handleLogin(JSON.parse(adminSession));
    } else {
      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          handleLogin({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata.name || session.user.email,
            role: session.user.user_metadata.role || "user",
          });
        }
      });
    }

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleLogin({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.name || session.user.email,
          role: session.user.user_metadata.role || "user",
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setUserRole(userData.role);
    if (userData.role === "admin") {
      setActiveTab("Monitoring");
    } else {
      setActiveTab("Dashboard");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("monetra_admin_session");
    setUser(null);
  };

  if (!user) {
     return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard onViewAll={() => setActiveTab("Transactions")} userName={user?.name} />;
      case "Transactions":
        return <Transactions />;
      case "Analysis":
        return <Analysis />;
      case "Reports":
        return <Reports />;
      case "Budgets":
        return <Budgets />;
      case "Notifications":
        return <Bills />;
      case "Monitoring":
        return <Monitoring />;
      case "AdminTransactions":
        return (
          <div className="p-10 text-center">
             <h2 className="text-2xl font-black text-white">Monitoring Transaksi</h2>
             <p className="text-slate-400 font-medium mt-2">Daftar semua transaksi user (Admin Only)...</p>
          </div>
        );
      case "Users":
        return <AdminDashboard />;
      case "Security":
        return <AdminSecurity />;
      case "Settings":
        return <Settings userName={user?.name} userEmail={user?.email} />;
      default:
        return (
          <div className="p-10 text-center">
             <h2 className="text-2xl font-black text-slate-900">Halaman {activeTab}</h2>
             <p className="text-slate-400 font-medium mt-2">Sedang dalam pengembangan...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans text-slate-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userRole}
        setUserRole={setUserRole}
        onLogout={handleLogout}
        userName={user?.name}
      />

      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <Header 
          onMenuOpen={() => setSidebarOpen(true)} 
          userRole={userRole} 
          setUserRole={setUserRole}
        />
        
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
