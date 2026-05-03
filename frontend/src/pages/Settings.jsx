import { useState } from 'react';
import { User, Lock, Save } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    toast.success('Password changed successfully');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <User size={18} className="text-emerald-500" />
          <h2 className="text-sm font-semibold text-slate-800">Profile Information</h2>
        </div>
        <form onSubmit={handleProfileSave} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-emerald-500 outline-none text-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-emerald-500 outline-none text-gray-800" />
            </div>
          </div>
          <Button type="submit" icon={Save}>Save Profile</Button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Lock size={18} className="text-emerald-500" />
          <h2 className="text-sm font-semibold text-slate-800">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordSave} className="p-4 space-y-4">
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-emerald-500 outline-none" />
            </div>
          </div>
          <Button type="submit" icon={Save}>Update Password</Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
