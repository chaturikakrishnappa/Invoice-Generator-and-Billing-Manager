import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, Users, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', path: '/invoices', icon: FileText },
    { name: 'Create Invoice', path: '/invoices/create', icon: PlusCircle },
    { name: 'Clients', path: '/clients', icon: Users },
  ];

  return (
    <aside className="w-56 bg-slate-800 flex flex-col h-full shadow-xl z-20">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">I+</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">InvoicePro</h1>
        </div>
      </div>
      
      <div className="px-3 py-6 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group font-medium text-sm",
                  isActive 
                    ? "bg-emerald-500 text-white shadow-sm" 
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} className={clsx(isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-sm text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-md transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
