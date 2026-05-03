import { Bell } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, title: 'Invoice Paid', message: 'Invoice #INV-1024 has been marked as paid.', time: '2 hours ago', unread: true },
    { id: 2, title: 'New Client', message: 'Client "Acme Corp" has been added to your directory.', time: '5 hours ago', unread: false },
    { id: 3, title: 'System Update', message: 'InvoicePro has been updated to version 2.0.', time: '1 day ago', unread: false },
  ];

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Notifications</h1>
        <p className="text-gray-500 text-sm mt-0.5">Stay updated with your billing activity</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notifications.map((note) => (
            <div key={note.id} className={`p-4 flex gap-4 ${note.unread ? 'bg-emerald-50/50' : 'bg-white'}`}>
              <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${note.unread ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Bell size={14} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-semibold ${note.unread ? 'text-slate-800' : 'text-gray-600'}`}>{note.title}</h4>
                  <span className="text-xs text-gray-400">{note.time}</span>
                </div>
                <p className="text-sm text-gray-500">{note.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
