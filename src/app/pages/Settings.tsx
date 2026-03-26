import React from 'react';
import { useStore } from '../StoreContext';
import { Settings as SettingsIcon, Shield } from 'lucide-react';
import { StaffManagement } from '../components/StaffManagement';

export const Settings = () => {
  const { user, currentShop } = useStore();

  // Check if user has admin role
  const isAdmin = user?.role === 'ADMIN';

  if (!currentShop || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <Shield size={64} className="text-[#8D6E63] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#5D4037] mb-2">No Shop Selected</h2>
          <p className="text-[#8D6E63]">Please select a shop to manage settings</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <Shield size={64} className="text-[#8D6E63] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#5D4037] mb-2">Access Denied</h2>
          <p className="text-[#8D6E63]">Only administrators can access settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#FDFBF7] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="text-[#5D4037]" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-[#3E2723]">Settings</h1>
            <p className="text-sm text-[#8D6E63] mt-1">Manage your shop and team</p>
          </div>
        </div>

        {/* Shop Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E6E0D4] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#3E2723] mb-4">Shop Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-[#8D6E63] block mb-1">Shop Name</label>
              <p className="font-semibold text-[#3E2723]">{currentShop.name}</p>
            </div>
            <div>
              <label className="text-sm text-[#8D6E63] block mb-1">Address</label>
              <p className="font-semibold text-[#3E2723]">{currentShop.address || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm text-[#8D6E63] block mb-1">Phone</label>
              <p className="font-semibold text-[#3E2723]">{currentShop.phone || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Staff Management - Only for Admin */}
        <StaffManagement shopId={currentShop.id} />
      </div>
    </div>
  );
};
