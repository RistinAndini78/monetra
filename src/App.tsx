import React, { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Analysis from "./pages/Analysis";
import Bills from "./pages/Bills";
import Settings from "./pages/Settings";
import { supabase } from "./lib/supabase";

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("monetra_active_tab") || "Dashboard";
  });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.name || session.user.email,
          avatarUrl: session.user.user_metadata.avatar_url
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.name || session.user.email,
          avatarUrl: session.user.user_metadata.avatar_url
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("monetra_active_tab", activeTab);
  }, [activeTab]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleUserUpdate = async () => {
    // Gunakan getUser() untuk memaksa ambil data terbaru dari server (bukan cache)
    const { data: { user: latestUser }, error } = await supabase.auth.getUser();
    if (!error && latestUser) {
      setUser({
        id: latestUser.id,
        email: latestUser.email,
        name: latestUser.user_metadata.name || latestUser.email,
        avatarUrl: latestUser.user_metadata.avatar_url
      });
    }
  };

  // Sinkronisasi lintas perangkat saat jendela difokuskan kembali
  useEffect(() => {
    const handleFocus = () => {
      if (user) handleUserUpdate();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);
    // Refresh otomatis setiap 30 detik jika tab tetap terbuka
    const interval = setInterval(() => {
      if (user) handleUserUpdate();
    }, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
      clearInterval(interval);
    };
  }, [user]);

  if (!user) {
     return <Auth onLogin={(u) => setUser(u)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard onViewAll={() => setActiveTab("Transactions")} userName={user?.name} />;
      case "Transactions":
        return <Transactions />;
      case "Analysis":
        return <Analysis />;
      case "Budgets":
        return <Budgets onNavigate={setActiveTab} />;
      case "Notifications":
        return <Bills />;
      case "Settings":
        return <Settings userName={user?.name} userEmail={user?.email} avatarUrl={user?.avatarUrl} onUserUpdate={handleUserUpdate} />;
      default:
        return <Dashboard onViewAll={() => setActiveTab("Transactions")} userName={user?.name} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole="user"
        onLogout={handleLogout}
        userName={user?.name}
        avatarUrl={user?.avatarUrl}
      />

      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <Header 
          onMenuOpen={() => setSidebarOpen(true)} 
          userRole="user"
          setActiveTab={setActiveTab}
        />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
