import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Settings as SettingsIcon, Users, Shield, Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { User, Role } from '../types';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const Settings = () => {
  const { user, users } = useStore();
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; userId: string; userName: string }>({
    show: false,
    userId: '',
    userName: ''
  });
  const [roleChangeConfirm, setRoleChangeConfirm] = useState<{ show: boolean; userId: string; newRole: Role | null }>({
    show: false,
    userId: '',
    newRole: null
  });
  const [statusChangeConfirm, setStatusChangeConfirm] = useState<{ show: boolean; userId: string; newStatus: boolean }>({
    show: false,
    userId: '',
    newStatus: false
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cashier' as Role,
  });

  // Only admin can access settings
  if (user?.role !== 'admin') {
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

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill all fields');
      return;
    }

    // In real app, this would call the API
    toast.success(`User ${newUser.name} added successfully`);
    setNewUser({ name: '', email: '', password: '', role: 'cashier' });
    setShowAddUser(false);
  };

  const handleUpdateRole = (userId: string, newRole: Role) => {
    setRoleChangeConfirm({ show: true, userId, newRole });
  };

  const confirmRoleChange = () => {
    // In real app, this would call staffAPI.updateRole
    toast.success('User role updated');
    setEditingUser(null);
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    setStatusChangeConfirm({ show: true, userId, newStatus: !currentStatus });
  };

  const confirmStatusChange = () => {
    // In real app, this would call staffAPI.updateStatus
    toast.success(statusChangeConfirm.newStatus ? 'User activated' : 'User deactivated');
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteConfirm({ show: true, userId, userName });
  };

  const confirmDelete = () => {
    // In real app, this would call staffAPI.delete
    toast.success('User deleted');
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cashier': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#FDFBF7] p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#5D4037] p-2 rounded-lg text-white">
            <SettingsIcon size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#5D4037]">Settings</h1>
            <p className="text-xs md:text-sm text-[#8D6E63]">Manage users and permissions</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className="flex items-center justify-center gap-2 bg-[#5D4037] text-white px-4 py-2 rounded-lg hover:bg-[#4E342E] transition-colors w-full md:w-auto"
        >
          <Plus size={20} />
          Add Admin
        </button>
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4] mb-6">
          <h3 className="text-lg font-bold text-[#5D4037] mb-4">Add New Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                className="w-full px-4 py-2 rounded-lg border border-[#E6E0D4] focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
              >
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 bg-[#5D4037] text-white px-4 py-2 rounded-lg hover:bg-[#4E342E] transition-colors"
            >
              <Check size={18} />
              Add Admin
            </button>
            <button
              onClick={() => setShowAddUser(false)}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E6E0D4]">
        <div className="p-6 border-b border-[#E6E0D4]">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-[#5D4037]" />
            <h3 className="text-lg font-bold text-[#5D4037]">User Management</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6E0D4] bg-[#FDFBF7]">
                <th className="text-left py-3 px-6 text-sm font-semibold text-[#5D4037]">Name</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-[#5D4037]">Email</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-[#5D4037]">Role</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-[#5D4037]">Status</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-[#5D4037]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[#F5F1E8] hover:bg-[#FDFBF7] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#5D4037] text-white flex items-center justify-center font-bold">
                        {u.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="font-medium text-[#3E2723]">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#8D6E63]">{u.email}</td>
                  <td className="py-4 px-6">
                    {editingUser === u.id ? (
                      <select
                        defaultValue={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value as Role)}
                        className="px-3 py-1 rounded-lg border border-[#E6E0D4] text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                      >
                        <option value="cashier">Cashier</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(u.role)}`}>
                        {u.role.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.active)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {u.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      {editingUser === u.id ? (
                        <button
                          onClick={() => setEditingUser(null)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Done"
                        >
                          <Check size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingUser(u.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Role"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Role Permissions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>Admin:</strong> Full access to all features including user management</li>
              <li><strong>Manager:</strong> Can manage inventory, view reports, and process sales</li>
              <li><strong>Cashier:</strong> Can process sales and view basic inventory</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, userId: '', userName: '' })}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteConfirm.userName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmDialog
        isOpen={roleChangeConfirm.show}
        onClose={() => setRoleChangeConfirm({ show: false, userId: '', newRole: null })}
        onConfirm={confirmRoleChange}
        title="Change User Role"
        message={`Are you sure you want to change this user's role to ${roleChangeConfirm.newRole?.toUpperCase()}? This will affect their access permissions.`}
        confirmText="Change Role"
        cancelText="Cancel"
        type="warning"
      />

      <ConfirmDialog
        isOpen={statusChangeConfirm.show}
        onClose={() => setStatusChangeConfirm({ show: false, userId: '', newStatus: false })}
        onConfirm={confirmStatusChange}
        title={statusChangeConfirm.newStatus ? "Activate User" : "Deactivate User"}
        message={`Are you sure you want to ${statusChangeConfirm.newStatus ? 'activate' : 'deactivate'} this user? ${!statusChangeConfirm.newStatus ? 'They will not be able to access the system.' : ''}`}
        confirmText={statusChangeConfirm.newStatus ? "Activate" : "Deactivate"}
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};
