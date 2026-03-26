import React, { useState } from 'react';
import { StoreProvider, useStore } from './StoreContext';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { Inventory } from './pages/Inventory';
import { Reports } from './pages/Reports';
import { Sales } from './pages/Sales';
import { Settings } from './pages/Settings';
import { Toaster } from 'sonner';

const MainContent = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden relative w-full lg:pl-0 pl-0">
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'pos' && <POS />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'sales' && <Sales />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
      <Toaster position="top-center" expand={true} richColors />
    </StoreProvider>
  );
}