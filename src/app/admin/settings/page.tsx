"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { supabase, updateShop, createShop, uploadShopLogo, getShopMembers, addShopMember, updateShopMember, removeShopMember, ShopMember } from '@/utils/supabase';

export default function SettingsPage() {
  const { user, shop, profile, refreshShop } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: true,
    push: false
  });
  const [staff, setStaff] = useState<ShopMember[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ShopMember | null>(null);
  const [userFormData, setUserFormData] = useState({ email: '', role: 'staff' as 'admin' | 'staff' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    upi_id: '',
    gstin: ''
  });

  useEffect(() => {
    if (shop && !isInitialized) {
      Promise.resolve().then(() => {
        setFormData({
          name: shop.name || '',
          address: shop.address || '',
          phone: shop.phone || '',
          upi_id: shop.upi_id || '',
          gstin: shop.gstin || ''
        });
        setNotifications({
          whatsapp: shop.notify_whatsapp ?? true,
          email: shop.notify_email ?? true,
          push: shop.notify_push ?? false
        });
        setIsInitialized(true);
      });
    }
  }, [shop, isInitialized]);

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (shop) {
        // Update existing shop
        const { error } = await updateShop(shop.id, {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          upi_id: formData.upi_id,
          gstin: formData.gstin
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      } else if (user) {
        // Create new shop if none exists
        const { error } = await createShop(user.id, {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          upi_id: formData.upi_id,
          gstin: formData.gstin
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Shop created successfully!' });
      }

      await refreshShop();
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to save changes.';
      setMessage({ type: 'error', text: errorMsg.includes('column') ? 'Database needs update. Please run SQL script.' : errorMsg });
    }
    setLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !shop) return;

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await uploadShopLogo(shop.id, file);
      if (error) throw error;

      await refreshShop();
      setMessage({ type: 'success', text: 'Logo updated successfully!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to upload logo.' });
    }
    setUploading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (passwords.new.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setShowPasswordModal(false);
      setPasswords({ new: '', confirm: '' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to update password.' });
    }
    setLoading(false);
  };

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      window.location.href = '/login?message=Account deactivated';
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to deactivate account.' });
    }
    setLoading(false);
  };

  const handleToggleNotify = async (key: 'whatsapp' | 'email' | 'push') => {
    if (!shop) return;
    const newValue = !notifications[key];
    setNotifications({...notifications, [key]: newValue});

    const dbKey = `notify_${key}`;
    try {
      const { error } = await updateShop(shop.id, { [dbKey]: newValue });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setNotifications({...notifications, [key]: !newValue});
      setMessage({ type: 'error', text: 'Failed to update preference.' });
    }
  };

  const loadStaff = useCallback(async () => {
    if (!shop) return;
    const { data, error } = await getShopMembers(shop.id);
    if (!error && data) {
      setStaff(data as unknown as ShopMember[]);
    }
  }, [shop]);

  useEffect(() => {
    if (shop && activeTab === 'users') {
      Promise.resolve().then(() => loadStaff());
    }
  }, [shop, activeTab, loadStaff]);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    setLoading(true);

    try {
      if (selectedUser) {
        const { error } = await updateShopMember(selectedUser.id, { role: userFormData.role });
        if (error) throw error;
        setMessage({ type: 'success', text: 'User updated successfully!' });
      } else {
        const { error } = await addShopMember(shop.id, userFormData.email, userFormData.role);
        if (error) throw error;
        setMessage({ type: 'success', text: 'User invited successfully!' });
      }
      setShowUserModal(false);
      loadStaff();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Action failed.' });
    }
    setLoading(false);
  };

  const handleUserDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      const { error } = await removeShopMember(id);
      if (error) throw error;
      loadStaff();
    } catch (err) {
      console.error(err);
    }
  };

  const settingsTabs = [
    { id: 'profile', icon: '🏪', label: 'Shop Profile' },
    { id: 'payments', icon: '💳', label: 'Payments & QR' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'users', icon: '👥', label: 'User Management' },
    { id: 'subscription', icon: '💎', label: 'Subscription' },
  ];

  return (
    <div className="dash-page dash-max anim-1">
      
      <div className="flex-between mb-32 flex-wrap gap-20">
        <div>
          <h1 className="dash-title">Settings</h1>
          <p className="dash-sub">Manage your business profile and preferences.</p>
        </div>
        <div className="flex-gap-sm align-center">
          {message.text && (
            <span className={`size-13 font-600 ${message.type === 'success' ? 'text-green' : 'text-red'}`}>
              {message.text}
            </span>
          )}
          <button 
            className="btn-primary" 
            onClick={handleSave} 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-container">
        {/* Settings Sidebar */}
        <div className="settings-nav">
          {settingsTabs.map(tab => (
            <button 
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="settings-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          
          {activeTab === 'profile' && (
            <div className="anim-1">
              <h2 className="size-20 font-800 mb-8">Shop Profile</h2>
              <p className="size-14 opacity-60 mb-32">Update your business details and branding.</p>

              <div className="grid-2-col gap-24 mb-32">
                <div className="form-group">
                  <label htmlFor="shopName">Shop Name</label>
                  <input 
                    id="shopName"
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="cust-search-input" 
                    title="Enter shop name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gstin">GSTIN</label>
                  <input 
                    id="gstin"
                    type="text" 
                    value={formData.gstin}
                    onChange={e => setFormData({...formData, gstin: e.target.value})}
                    placeholder="27AAACG1234F1Z5" 
                    className="cust-search-input" 
                    title="Enter GST number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ownerName">Owner Name</label>
                  <input id="ownerName" type="text" defaultValue={profile?.full_name || ''} className="cust-search-input" disabled title="Owner name cannot be changed here" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Contact Number</label>
                  <input 
                    id="phone"
                    type="text" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="cust-search-input" 
                    title="Enter contact phone number"
                  />
                </div>
              </div>

              <div className="form-group mb-32">
                <label htmlFor="upiId">UPI ID (VPA)</label>
                <input 
                  id="upiId"
                  type="text" 
                  placeholder="shopname@upi" 
                  className="cust-search-input"
                  value={formData.upi_id}
                  onChange={e => setFormData({...formData, upi_id: e.target.value})}
                  title="Enter UPI ID for payments"
                />
                <p className="size-12 opacity-60 mt-8">This ID will be used to generate the QR code in the Customer Portal.</p>
              </div>

              <div className="form-group mb-40">
                <label htmlFor="address">Address</label>
                <textarea 
                  id="address"
                  rows={3} 
                  className="cust-search-input py-12 h-auto" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  title="Enter full shop address"
                />
              </div>

              <h3 className="size-16 font-800 mb-16">Shop Logo</h3>
              <div className="flex-gap-lg align-center">
                <div className="logo-preview">
                  {shop?.logo_url ? (
                    <Image 
                      src={shop.logo_url} 
                      alt="Logo" 
                      width={80} 
                      height={80} 
                      className="logo-img" 
                    />
                  ) : (
                    <span className="size-32">🏪</span>
                  )}
                </div>
                <div className="flex-gap-sm">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleLogoUpload} 
                    hidden 
                    accept="image/*" 
                  />
                  <button 
                    className="btn-outline size-13" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload New'}
                  </button>
                  {shop?.logo_url && (
                    <button 
                      className="text-red size-13 font-700"
                      onClick={async () => {
                        await updateShop(shop.id, { logo_url: null });
                        await refreshShop();
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="anim-1">
              <h2 className="size-20 font-800 mb-8">Notification Preferences</h2>
              <p className="size-14 opacity-60 mb-32">Control how you receive updates and debt reminders.</p>

              <div className="flex-col-gap">
                <div className="notify-item" onClick={() => handleToggleNotify('whatsapp')}>
                  <div className="notify-info">
                    <div className="notify-icon bg-green-soft">💬</div>
                    <div>
                      <div className="font-700 size-15">WhatsApp Reminders</div>
                      <div className="size-13 opacity-60">Send automated payment reminders to customers.</div>
                    </div>
                  </div>
                  <div className={`toggle ${notifications.whatsapp ? 'active' : ''}`}></div>
                </div>

                <div className="notify-item" onClick={() => handleToggleNotify('email')}>
                  <div className="notify-info">
                    <div className="notify-icon bg-blue-soft">✉️</div>
                    <div>
                      <div className="font-700 size-15">Email Alerts</div>
                      <div className="size-13 opacity-60">Weekly summary of ledger activities and dues.</div>
                    </div>
                  </div>
                  <div className={`toggle ${notifications.email ? 'active' : ''}`}></div>
                </div>

                <div className="notify-item" onClick={() => handleToggleNotify('push')}>
                  <div className="notify-info">
                    <div className="notify-icon bg-red-soft">🔔</div>
                    <div>
                      <div className="font-700 size-15">Push Notifications</div>
                      <div className="size-13 opacity-60">Immediate mobile alerts for new transactions.</div>
                    </div>
                  </div>
                  <div className={`toggle ${notifications.push ? 'active' : ''}`}></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="anim-1">
              <div className="flex-between mb-24">
                <div>
                  <h2 className="size-20 font-800 mb-4">User Management</h2>
                  <p className="size-14 opacity-60">Manage staff access and roles.</p>
                </div>
                <button 
                  className="btn-primary size-12 py-8 px-16"
                  onClick={() => {
                    setSelectedUser(null);
                    setUserFormData({ email: '', role: 'staff' });
                    setShowUserModal(true);
                  }}
                >
                  + Add User
                </button>
              </div>

              <div className="table-wrapper border radius-12">
                <table className="cust-table">
                  <thead>
                    <tr>
                      <th>USER</th>
                      <th>ROLE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="font-700">{profile?.full_name || 'Owner'}</div>
                        <div className="size-12 opacity-60">{user?.email}</div>
                      </td>
                      <td><span className="m-badge badge-admin">OWNER</span></td>
                      <td><span className="flex-gap-xs align-center size-12 font-700 text-green"><span className="dot green"></span> Active</span></td>
                      <td>-</td>
                    </tr>
                    {staff.map(member => (
                      <tr key={member.id}>
                        <td>
                          <div className="font-700">{member.profiles?.full_name || 'Team Member'}</div>
                          <div className="size-12 opacity-60">{member.email}</div>
                        </td>
                        <td>
                          <span className={`m-badge ${member.role === 'admin' ? 'badge-admin' : 'badge-staff'}`}>
                            {member.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`flex-gap-xs align-center size-12 font-700 ${member.status === 'active' ? 'text-green' : 'text-orange'}`}>
                            <span className={`dot ${member.status === 'active' ? 'green' : 'orange'}`}></span>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="flex-gap-sm">
                            <button 
                              className="btn-icon" 
                              onClick={() => {
                                setSelectedUser(member);
                                setUserFormData({ email: member.email, role: member.role });
                                setShowUserModal(true);
                              }}
                            >
                              ✏️
                            </button>
                            <button className="btn-icon" onClick={() => handleUserDelete(member.id)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-48 pt-32 border-top">
            <h3 className="size-16 font-800 mb-16">Account Actions</h3>
            <div className="grid-2-col gap-24">
              <div className="action-card" onClick={() => setShowPasswordModal(true)}>
                <div className="flex-gap-sm align-center">
                  <div className="action-icon">🔑</div>
                  <div>
                    <div className="font-700 size-14">Change Password</div>
                    <div className="size-12 opacity-60">Secure your account with a new password.</div>
                  </div>
                </div>
                <span>➡️</span>
              </div>
              <div className="action-card danger" onClick={() => setShowDeactivateModal(true)}>
                <div className="flex-gap-sm align-center">
                  <div className="action-icon">🗑️</div>
                  <div>
                    <div className="font-700 size-14">Deactivate Account</div>
                    <div className="size-12 opacity-60">Permanently remove your shop and data.</div>
                  </div>
                </div>
                <span>➡️</span>
              </div>
            </div>
          </div>

          {/* User Modal */}
          {showUserModal && (
            <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
              <div className="modal-content anim-up" onClick={e => e.stopPropagation()}>
                <h3 className="size-18 font-800 mb-8">{selectedUser ? 'Edit User' : 'Invite New User'}</h3>
                <p className="size-14 opacity-60 mb-24">
                  {selectedUser ? 'Change permissions for this member.' : 'Send an invite to join your shop team.'}
                </p>
                <form onSubmit={handleUserSubmit} className="flex-col-gap">
                  <div>
                    <label className="size-13 font-700 mb-4 block">Email Address</label>
                    <input 
                      type="email" 
                      className="input w-100" 
                      required 
                      disabled={!!selectedUser}
                      value={userFormData.email}
                      onChange={e => setUserFormData({...userFormData, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="size-13 font-700 mb-4 block">Access Role</label>
                    <select 
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({...userFormData, role: e.target.value as 'admin' | 'staff'})}
                      className="input w-100"
                      title="Select User Role"
                      aria-label="Select User Role"
                    >
                      <option value="staff">Staff (Limited Access)</option>
                      <option value="admin">Admin (Full Access)</option>
                    </select>
                  </div>
                  <div className="flex-gap-sm mt-16">
                    <button type="button" className="btn-outline flex-1" onClick={() => setShowUserModal(false)}>Cancel</button>
                    <button type="submit" className="btn-primary flex-1" disabled={loading}>
                      {loading ? 'Saving...' : (selectedUser ? 'Update' : 'Send Invite')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Change Password Modal */}
          {showPasswordModal && (
            <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
              <div className="modal-content anim-up" onClick={e => e.stopPropagation()}>
                <h3 className="size-18 font-800 mb-8">Update Password</h3>
                <p className="size-14 opacity-60 mb-24">Enter a new secure password for your account.</p>
                <form onSubmit={handlePasswordUpdate} className="flex-col-gap">
                  <div>
                    <label className="size-13 font-700 mb-4 block">New Password</label>
                    <input 
                      type="password" 
                      className="input w-100" 
                      required 
                      value={passwords.new}
                      onChange={e => setPasswords({...passwords, new: e.target.value})}
                      title="New Password"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="size-13 font-700 mb-4 block">Confirm Password</label>
                    <input 
                      type="password" 
                      className="input w-100" 
                      required 
                      value={passwords.confirm}
                      onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                      title="Confirm Password"
                      placeholder="Confirm your new password"
                    />
                  </div>
                  <div className="flex-gap-sm mt-16">
                    <button type="button" className="btn-outline flex-1" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                    <button type="submit" className="btn-primary flex-1" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Deactivate Modal */}
          {showDeactivateModal && (
            <div className="modal-overlay" onClick={() => setShowDeactivateModal(false)}>
              <div className="modal-content anim-up" onClick={e => e.stopPropagation()}>
                <div className="size-32 mb-16 text-center">⚠️</div>
                <h3 className="size-18 font-800 mb-8 text-center">Are you absolutely sure?</h3>
                <p className="size-14 opacity-60 mb-32 text-center">
                  This action will permanently disable your shop and remove all access to your records. This cannot be undone.
                </p>
                <div className="flex-gap-sm">
                  <button className="btn-outline flex-1" onClick={() => setShowDeactivateModal(false)}>No, Keep it</button>
                  <button className="btn-primary flex-1 bg-red" onClick={handleDeactivate} disabled={loading}>
                    {loading ? 'Processing...' : 'Yes, Deactivate'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>


    </div>
  );
}
