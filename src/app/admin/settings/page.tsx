"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { shop, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const settingsTabs = [
    { id: 'profile', icon: '🏪', label: 'Shop Profile' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'users', icon: '👥', label: 'User Management' },
    { id: 'subscription', icon: '💳', label: 'Subscription' },
    { id: 'api', icon: '🔌', label: 'API & Integrations' },
  ];

  return (
    <div className="dash-page dash-max anim-1">
      
      <div className="flex-between mb-32 flex-wrap gap-20">
        <div>
          <h1 className="dash-title">Settings</h1>
          <p className="dash-sub">Manage your business profile and preferences.</p>
        </div>
        <button className="btn-primary">Save Changes</button>
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
                  <label>Shop Name</label>
                  <input type="text" defaultValue={shop?.name || ''} className="cust-search-input" />
                </div>
                <div className="form-group">
                  <label>GSTIN</label>
                  <input type="text" placeholder="27AAACG1234F1Z5" className="cust-search-input" />
                </div>
                <div className="form-group">
                  <label>Owner Name</label>
                  <input type="text" defaultValue={profile?.full_name || ''} className="cust-search-input" />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" defaultValue={shop?.phone || ''} className="cust-search-input" />
                </div>
              </div>

              <div className="form-group mb-40">
                <label>Address</label>
                <textarea 
                  rows={3} 
                  className="cust-search-input py-12" 
                  defaultValue={shop?.address || ''}
                  style={{ height: 'auto' }}
                />
              </div>

              <h3 className="size-16 font-800 mb-16">Shop Logo</h3>
              <div className="flex-gap-lg align-center">
                <div className="logo-preview">
                  <span className="size-32">🏪</span>
                </div>
                <div className="flex-gap-sm">
                  <button className="btn-outline size-13">Upload New</button>
                  <button className="text-red size-13 font-700">Remove</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="anim-1">
              <h2 className="size-20 font-800 mb-8">Notification Preferences</h2>
              <p className="size-14 opacity-60 mb-32">Control how you receive updates and debt reminders.</p>

              <div className="flex-col-gap">
                <div className="notify-item">
                  <div className="notify-info">
                    <div className="notify-icon bg-green-soft">💬</div>
                    <div>
                      <div className="font-700 size-15">WhatsApp Reminders</div>
                      <div className="size-13 opacity-60">Send automated payment reminders to customers.</div>
                    </div>
                  </div>
                  <div className="toggle active"></div>
                </div>

                <div className="notify-item">
                  <div className="notify-info">
                    <div className="notify-icon bg-blue-soft">✉️</div>
                    <div>
                      <div className="font-700 size-15">Email Alerts</div>
                      <div className="size-13 opacity-60">Weekly summary of ledger activities and dues.</div>
                    </div>
                  </div>
                  <div className="toggle active"></div>
                </div>

                <div className="notify-item">
                  <div className="notify-info">
                    <div className="notify-icon bg-red-soft">🔔</div>
                    <div>
                      <div className="font-700 size-15">Push Notifications</div>
                      <div className="size-13 opacity-60">Immediate mobile alerts for new transactions.</div>
                    </div>
                  </div>
                  <div className="toggle"></div>
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
                <button className="btn-primary size-12 py-8 px-16">+ Add User</button>
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
                        <div className="font-700">{profile?.full_name}</div>
                        <div className="size-12 opacity-60">owner@ledgerkart.com</div>
                      </td>
                      <td><span className="m-badge" style={{ background: '#EEF2FF', color: '#4F46E5' }}>ADMIN</span></td>
                      <td><span className="flex-gap-xs align-center size-12 font-700 text-green"><span className="dot green"></span> Active</span></td>
                      <td>✏️</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-700">Amit Sharma</div>
                        <div className="size-12 opacity-60">amit.s@ledgerkart.com</div>
                      </td>
                      <td><span className="m-badge" style={{ background: '#F3F4F6', color: '#374151' }}>STAFF</span></td>
                      <td><span className="flex-gap-xs align-center size-12 font-700 text-green"><span className="dot green"></span> Active</span></td>
                      <td>✏️</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-48 pt-32 border-top">
            <h3 className="size-16 font-800 mb-16">Account Actions</h3>
            <div className="grid-2-col gap-24">
              <div className="action-card">
                <div className="flex-gap-sm align-center">
                  <div className="action-icon">🔑</div>
                  <div>
                    <div className="font-700 size-14">Change Password</div>
                    <div className="size-12 opacity-60">Secure your account with a new password.</div>
                  </div>
                </div>
                <span>➡️</span>
              </div>
              <div className="action-card danger">
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

        </div>
      </div>

      <style jsx>{`
        .settings-container { display: grid; grid-template-columns: 280px 1fr; gap: 40px; }
        .settings-nav { display: flex; flex-direction: column; gap: 8px; }
        .settings-tab { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 14px; font-weight: 600; font-size: 14px; color: var(--muted); border: 1px solid transparent; background: none; cursor: pointer; transition: all 0.2s; text-align: left; }
        .settings-tab:hover { background: var(--surface); color: var(--ink); }
        .settings-tab.active { background: var(--white); border-color: var(--border); color: var(--accent); box-shadow: var(--shadow-sm); }
        .settings-icon { font-size: 18px; }
        .settings-content { background: var(--white); border: 1px solid var(--border); border-radius: 24px; padding: 40px; min-height: 600px; }
        .logo-preview { width: 80px; height: 80px; border-radius: 20px; border: 2px dashed var(--border); display: flex; align-items: center; justify-content: center; background: #F9FAFB; }
        .notify-item { display: flex; justify-content: space-between; align-items: center; padding: 20px; border: 1px solid var(--border); border-radius: 16px; margin-bottom: 12px; }
        .notify-info { display: flex; align-items: center; gap: 16px; }
        .notify-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .bg-green-soft { background: #ECFDF5; }
        .bg-blue-soft { background: #EEF2FF; }
        .bg-red-soft { background: #FEF2F2; }
        .toggle { width: 48px; height: 26px; background: #E5E7EB; border-radius: 20px; position: relative; cursor: pointer; transition: all 0.3s; }
        .toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s; }
        .toggle.active { background: var(--accent); }
        .toggle.active::after { left: 25px; }
        .action-card { padding: 20px; border: 1px solid var(--border); border-radius: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s; }
        .action-card:hover { border-color: var(--accent); background: var(--surface); }
        .action-card.danger:hover { border-color: #EF4444; background: #FEF2F2; }
        .action-icon { width: 40px; height: 40px; background: #F3F4F6; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        @media (max-width: 1024px) { .settings-container { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
