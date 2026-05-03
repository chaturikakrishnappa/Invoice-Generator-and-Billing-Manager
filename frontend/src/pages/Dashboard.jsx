import { useEffect, useState } from 'react';
import { IndianRupee, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, paidInvoices: 0, pendingInvoices: 0, overdueInvoices: 0 });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/invoices');
        const invoices = response.data.invoices;
        
        let revenue = 0;
        let paid = 0;
        let pending = 0;
        let overdue = 0;

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = {};

        invoices.forEach(inv => {
          if (inv.status === 'Paid') { revenue += inv.total; paid++; }
          else if (inv.status === 'Unpaid' || inv.status === 'Pending') pending++;
          else if (inv.status === 'Overdue') overdue++;

          const date = new Date(inv.issueDate);
          const month = months[date.getMonth()];
          if (!monthlyData[month]) monthlyData[month] = { name: month, revenue: 0 };
          if (inv.status === 'Paid') monthlyData[month].revenue += inv.total;
        });

        setStats({ totalRevenue: revenue, paidInvoices: paid, pendingInvoices: pending, overdueInvoices: overdue });
        setChartData(Object.values(monthlyData));
        setPieData([
          { name: 'Paid', value: paid },
          { name: 'Pending', value: pending },
          { name: 'Overdue', value: overdue }
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">Here's what's happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Revenue" value={`₹ ${stats.totalRevenue.toLocaleString()}`} icon={IndianRupee} colorClass="bg-emerald-50 text-emerald-600" delay={0.1} />
        <DashboardCard title="Paid Invoices" value={stats.paidInvoices} icon={CheckCircle} colorClass="bg-blue-50 text-blue-600" delay={0.2} />
        <DashboardCard title="Pending Invoices" value={stats.pendingInvoices} icon={Clock} colorClass="bg-yellow-50 text-yellow-600" delay={0.3} />
        <DashboardCard title="Overdue" value={stats.overdueInvoices} icon={AlertCircle} colorClass="bg-red-50 text-red-600" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={16} className="text-emerald-500"/> Revenue Overview
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `₹${value}`} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={16} className="text-emerald-500"/> Invoice Status
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
