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

  // Role-based access control
  const userRole = user.role;
  const canAccessInventory = ['ADMIN', 'MANAGER'].includes(userRole);
  const canAccessReports = ['ADMIN', 'MANAGER'].includes(userRole);
  const canAccessSettings = ['ADMIN'].includes(userRole);
  const canAccessDashboard = ['ADMIN', 'MANAGER'].includes(userRole);

  // Redirect cashiers to POS if they try to access restricted pages
  React.useEffect(() => {
    if (userRole === 'CASHIER' && activeTab !== 'pos' && activeTab !== 'sales') {
      setActiveTab('pos');
    }
  }, [userRole, activeTab]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden relative w-full lg:pl-0 pl-0">
        {activeTab === 'dashboard' && canAccessDashboard && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'pos' && <POS />}
        {activeTab === 'inventory' && canAccessInventory && <Inventory />}
        {activeTab === 'sales' && <Sales />}
        {activeTab === 'reports' && canAccessReports && <Reports />}
        {activeTab === 'settings' && canAccessSettings && <Settings />}
        
        {/* Show access denied for restricted pages */}
        {activeTab === 'dashboard' && !canAccessDashboard && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#5D4037] mb-2">Access Denied</h2>
              <p className="text-[#8D6E63]">You don't have permission to access this page.</p>
            </div>
          </div>
        )}
        {activeTab === 'inventory' && !canAccessInventory && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#5D4037] mb-2">Access Denied</h2>
              <p className="text-[#8D6E63]">You don't have permission to access inventory management.</p>
            </div>
          </div>
        )}
        {activeTab === 'reports' && !canAccessReports && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#5D4037] mb-2">Access Denied</h2>
              <p className="text-[#8D6E63]">You don't have permission to access reports.</p>
            </div>
          </div>
        )}
        {activeTab === 'settings' && !canAccessSettings && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#5D4037] mb-2">Access Denied</h2>
              <p className="text-[#8D6E63]">Only administrators can access settings.</p>
            </div>
          </div>
        )}
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