import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  History, 
  Settings, 
  LogOut,
  Coffee,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '../StoreContext';
import { clsx } from 'clsx';
import { ConfirmDialog } from './ConfirmDialog';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

import { Clock } from './Clock';

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // Sidebar closed by default on mobile, always visible on desktop
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager'] },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart, roles: ['admin', 'manager', 'cashier'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin', 'manager'] },
    { id: 'customers', label: 'Customers', icon: Users, roles: ['admin', 'manager', 'cashier'] },
    { id: 'transactions', label: 'History', icon: History, roles: ['admin', 'manager', 'cashier'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Hamburger Button - Only on mobile/tablet */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-[#5D4037] text-white rounded-xl shadow-lg hover:bg-[#4E342E] transition-colors lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay - Only on mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed lg:relative h-screen w-64 bg-[#FDFBF7] border-r border-[#E6E0D4] flex flex-col justify-between py-6 transition-transform duration-300 ease-in-out z-40",
        "lg:translate-x-0", // Always visible on desktop
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" // Slide on mobile
      )}>
        <div>
          <div className="flex items-center justify-start px-6 mb-10 gap-3 lg:mt-0 mt-12">
            <div className="bg-[#5D4037] p-2 rounded-xl text-white">
              <Coffee size={24} />
            </div>
            <span className="font-bold text-xl text-[#5D4037] tracking-tight">Bean & Brew</span>
          </div>
          
          <div className="px-3 mb-6">
            <Clock />
          </div>

          <nav className="flex flex-col gap-2 px-3">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-[#5D4037] text-white shadow-lg shadow-[#5D4037]/20" 
                      : "text-[#8D6E63] hover:bg-[#EFEBE0]"
                  )}
                >
                  <Icon size={22} className={clsx(isActive ? "text-white" : "text-[#8D6E63] group-hover:text-[#5D4037]")} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-3">
          <div className="mb-4 px-3">
            <p className="text-xs text-[#8D6E63] font-semibold uppercase tracking-wider mb-2">Logged in as</p>
            <div className="flex items-center gap-3">
              {user?.avatar && (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-[#E6E0D4]" />
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-[#5D4037] truncate">{user?.name}</span>
                <span className="text-xs text-[#8D6E63] capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-[#8D6E63] hover:bg-[#FFE5E5] hover:text-red-600 transition-colors"
          >
            <LogOut size={22} />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        <ConfirmDialog
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={confirmLogout}
          title="Confirm Logout"
          message="Are you sure you want to logout? Any unsaved changes will be lost."
          confirmText="Logout"
          cancelText="Cancel"
          type="warning"
        />
      </div>
    </>
  );
};
