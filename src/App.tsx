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
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.name || session.user.email,
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
      case "Reports":
        return <Reports />;
      case "Budgets":
        return <Budgets />;
      case "Settings":
        return <Settings userName={user?.name} userEmail={user?.email} />;
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
      />

      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <Header 
          onMenuOpen={() => setSidebarOpen(true)} 
          userRole="user"
        />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
