import { useState, useRef, useEffect } from 'react';
import { Settings, Bell, Search, User, Lock, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const settingsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (settingsRef.current && !settingsRef.current.contains(event.target)) setShowSettings(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/invoices?q=' + encodeURIComponent(searchQuery));
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center flex-1">
      </div>
      
      <div className="flex items-center gap-4 text-gray-500">
        <div className="relative" ref={notifRef}>
          <button onClick={() => {setShowNotifications(!showNotifications); setShowSettings(false);}} className="p-2 hover:bg-gray-100 rounded-full transition-colors relative text-gray-600">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100 font-semibold text-sm text-slate-800">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-slate-800">Invoice Paid</p>
                  <p className="text-xs text-gray-500 mt-0.5">Invoice #INV-1024 has been marked as paid.</p>
                </div>
                <div className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-slate-800">New Client</p>
                  <p className="text-xs text-gray-500 mt-0.5">Client "Acme Corp" has been added.</p>
                </div>
              </div>
              <Link to="/notifications" onClick={() => setShowNotifications(false)} className="block p-3 text-center text-xs text-emerald-600 hover:text-emerald-700 font-medium bg-gray-50">View All</Link>
            </div>
          )}
        </div>

        <div className="relative" ref={settingsRef}>
          <button onClick={() => {setShowSettings(!showSettings); setShowNotifications(false);}} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <Settings size={18} />
          </button>

          {showSettings && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              <Link to="/settings" onClick={() => setShowSettings(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <User size={16} className="text-gray-400" />
                Profile Settings
              </Link>
              <Link to="/settings" onClick={() => setShowSettings(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Lock size={16} className="text-gray-400" />
                Security
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
