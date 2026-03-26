import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, UserCheck, UserX, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { staffAPI } from '../services/api';
import { useStore } from '../StoreContext';

interface StaffMember {
  id: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER';
  isActive: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  type = 'warning',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-full ${
            type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            <AlertTriangle className={`${
              type === 'danger' ? 'text-red-600' : 'text-yellow-600'
            }`} size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#3E2723] mb-2">{title}</h3>
            <p className="text-[#8D6E63]">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl transition-colors font-medium text-white ${
              type === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const StaffManagement = ({ shopId }: { shopId: string }) => {
  const { user: currentUser } = useStore();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning',
  });
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER' | 'CASHIER'>('CASHIER');
  const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'MANAGER' | 'CASHIER'>('ALL');

  useEffect(() => {
    loadStaff();
  }, [shopId]);

  const loadStaff = async () => {
    try {
      const response: any = await staffAPI.getAll(shopId);
      setStaff(response.data);
    } catch (error) {
      toast.error('Failed to load staff');
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRole('CASHIER');
    setShowPassword(false);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password) {
      toast.error('Please fill all required fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await staffAPI.create(shopId, {
        firstName,
        lastName,
        email,
        password,
        role,
      });
      toast.success('Staff member created successfully');
      resetForm();
      setShowAddForm(false);
      await loadStaff();
    } catch (error: any) {
      toast.error(error.error || 'Failed to create staff member');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (staffId: string, newRole: string, staffEmail: string) => {
    if (currentUser?.email === staffEmail) {
      toast.error('You cannot change your own role');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Change Role',
      message: `Are you sure you want to change this staff member's role to ${newRole}?`,
      type: 'warning',
      onConfirm: async () => {
        try {
          await staffAPI.updateRole(shopId, staffId, newRole);
          toast.success('Role updated');
          await loadStaff();
        } catch (error: any) {
          toast.error(error.error || 'Failed to update role');
        }
      },
    });
  };

  const handleToggleStatus = async (staffId: string, isActive: boolean, staffEmail: string) => {
    if (currentUser?.email === staffEmail) {
      toast.error('You cannot deactivate yourself');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: isActive ? 'Deactivate Staff' : 'Activate Staff',
      message: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this staff member?`,
      type: 'warning',
      onConfirm: async () => {
        try {
          await staffAPI.updateStatus(shopId, staffId, !isActive);
          toast.success(isActive ? 'Staff deactivated' : 'Staff activated');
          await loadStaff();
        } catch (error: any) {
          toast.error(error.error || 'Failed to update status');
        }
      },
    });
  };

  const handleDeleteStaff = async (staffId: string, staffName: string, staffEmail: string) => {
    if (currentUser?.email === staffEmail) {
      toast.error('You cannot delete yourself');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Remove Staff Member',
      message: `Are you sure you want to remove ${staffName}? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          await staffAPI.delete(shopId, staffId);
          toast.success('Staff member removed');
          await loadStaff();
        } catch (error: any) {
          toast.error(error.error || 'Failed to remove staff');
        }
      },
    });
  };

  const filteredStaff = filterRole === 'ALL' ? staff : staff.filter(s => s.role === filterRole);
  const adminCount = staff.filter(s => s.role === 'ADMIN').length;
  const managerCount = staff.filter(s => s.role === 'MANAGER').length;
  const cashierCount = staff.filter(s => s.role === 'CASHIER').length;
  const isCurrentUser = (email: string) => currentUser?.email === email;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-[#E6E0D4] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-[#5D4037]" size={28} />
              <h2 className="text-2xl font-bold text-[#3E2723]">Staff Management</h2>
            </div>
            <p className="text-sm text-[#8D6E63]">Manage your team members and their roles</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5D4037] text-white rounded-xl hover:bg-[#4E342E] transition-colors shadow-md"
          >
            <Plus size={20} />
            Add Staff
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E6E0D4]">
            <p className="text-sm text-[#8D6E63] mb-1">Total Staff</p>
            <p className="text-2xl font-bold text-[#3E2723]">{staff.length}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-600 mb-1">Admins</p>
            <p className="text-2xl font-bold text-purple-700">{adminCount}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">Managers</p>
            <p className="text-2xl font-bold text-blue-700">{managerCount}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-600 mb-1">Cashiers</p>
            <p className="text-2xl font-bold text-green-700">{cashierCount}</p>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-6 p-6 bg-[#FDFBF7] rounded-xl border border-[#E6E0D4]">
            <h3 className="font-semibold text-[#5D4037] mb-4 flex items-center gap-2">
              <Shield size={20} />
              Create New Staff Member
            </h3>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5D4037] mb-2">First Name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-2 rounded-xl border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5D4037] mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-2 rounded-xl border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5D4037] mb-2">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-2 rounded-xl border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5D4037] mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-2 rounded-xl border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037] pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#5D4037]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5D4037] mb-2">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-xl border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                >
                  <option value="CASHIER">Cashier - POS, Customers, History</option>
                  <option value="MANAGER">Manager - All except Settings</option>
                  <option value="ADMIN">Admin - Full Access</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#5D4037] text-white rounded-xl hover:bg-[#4E342E] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Staff Member'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-[#5D4037]">Filter by role:</span>
          <div className="flex gap-2">
            {['ALL', 'ADMIN', 'MANAGER', 'CASHIER'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterRole === r ? 'bg-[#5D4037] text-white' : 'bg-[#FDFBF7] text-[#8D6E63] hover:bg-[#EFEBE0]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredStaff.map((member) => {
            const isSelf = isCurrentUser(member.user.email);
            
            return (
              <div
                key={member.id}
                className={`p-4 rounded-xl border transition-all ${
                  member.isActive ? 'border-[#E6E0D4] bg-white hover:shadow-md' : 'border-gray-300 bg-gray-50 opacity-75'
                } ${isSelf ? 'ring-2 ring-[#5D4037] ring-opacity-30' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-[#3E2723] text-lg">
                        {member.user.firstName} {member.user.lastName}
                      </h3>
                      {isSelf && (
                        <span className="px-2 py-1 text-xs bg-[#5D4037] text-white rounded-full font-semibold">You</span>
                      )}
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        member.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {member.role}
                      </span>
                      {!member.isActive && (
                        <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-[#8D6E63]">{member.user.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => handleChangeRole(member.id, e.target.value, member.user.email)}
                      disabled={isSelf}
                      className={`px-3 py-2 rounded-lg border border-[#E6E0D4] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5D4037] ${
                        isSelf ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="CASHIER">Cashier</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>

                    <button
                      onClick={() => handleToggleStatus(member.id, member.isActive, member.user.email)}
                      disabled={isSelf}
                      className={`p-2 rounded-lg transition-colors ${
                        isSelf ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                        member.isActive ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isSelf ? 'Cannot modify yourself' : (member.isActive ? 'Deactivate' : 'Activate')}
                    >
                      {member.isActive ? <UserCheck size={20} /> : <UserX size={20} />}
                    </button>

                    <button
                      onClick={() => handleDeleteStaff(member.id, `${member.user.firstName} ${member.user.lastName}`, member.user.email)}
                      disabled={isSelf}
                      className={`p-2 rounded-lg transition-colors ${
                        isSelf ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                      title={isSelf ? 'Cannot delete yourself' : 'Remove staff'}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredStaff.length === 0 && (
            <div className="text-center py-12 text-[#8D6E63]">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">
                {filterRole === 'ALL' ? 'No staff members yet' : `No ${filterRole.toLowerCase()}s found`}
              </p>
              <p className="text-sm">
                {filterRole === 'ALL' ? 'Add your first staff member using the button above' : 'Try changing the filter or add new staff members'}
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.type === 'danger' ? 'Delete' : 'Confirm'}
      />
    </>
  );
};
