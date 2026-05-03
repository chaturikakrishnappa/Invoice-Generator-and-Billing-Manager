import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Search, FileText, Download, Eye, Trash2, X } from 'lucide-react';
import api from '../services/api';
import Table from '../components/Table';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewInvoice, setViewInvoice] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearch(q);
  }, [location.search]);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data.invoices);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await api.delete(`/invoices/${id}`);
        toast.success('Invoice deleted successfully');
        fetchInvoices();
      } catch (error) {
        toast.error('Failed to delete invoice');
      }
    }
  };

  const handleDownload = async (invoiceNo, id) => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${invoiceNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF downloaded!', { id: 'pdf' });
    } catch (error) {
      toast.error('Failed to download PDF', { id: 'pdf' });
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) || 
                          (inv.clientName && inv.clientName.toLowerCase().includes(search.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && inv.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const columns = [
    { label: 'Invoice No' },
    { label: 'Client' },
    { label: 'Amount' },
    { label: 'Status' },
    { label: 'Issue Date' },
    { label: 'Actions', align: 'right' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Invoices</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage and track your billing</p>
        </div>
        <Link to="/invoices/create">
          <Button icon={Plus}>Create Invoice</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search invoices by number or client..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-emerald-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
          </div>
        ) : (
          <Table columns={columns}>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2 font-medium text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText size={14} />
                  </div>
                  {invoice.invoiceNo}
                </td>
                <td className="px-3 py-2 text-gray-600 font-medium">{invoice.clientName || 'Unknown Client'}</td>
                <td className="px-3 py-2 font-semibold text-slate-800">₹{invoice.total.toLocaleString()}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    invoice.status === 'Paid' ? 'bg-green-50 text-green-700 border border-green-200' : 
                    invoice.status === 'Overdue' ? 'bg-red-50 text-red-700 border border-red-200' : 
                    'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-gray-600">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setViewInvoice(invoice)} className="p-1 text-gray-400 hover:text-emerald-600 transition-colors" title="View"><Eye size={16} /></button>
                    <button onClick={() => handleDownload(invoice.invoiceNo, invoice._id)} className="p-1 text-gray-400 hover:text-emerald-600 transition-colors" title="Download PDF"><Download size={16} /></button>
                    <button onClick={() => handleDelete(invoice._id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="6" className="px-3 py-8 text-center text-sm text-gray-500">
                  No invoices found. <Link to="/invoices/create" className="text-emerald-600 hover:underline">Create one</Link>
                </td>
              </tr>
            )}
          </Table>
        )}
      </div>

      {/* View Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">Invoice {viewInvoice.invoiceNo}</h2>
              </div>
              <button onClick={() => setViewInvoice(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex justify-between mb-8">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-semibold ${
                    viewInvoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                    viewInvoice.status === 'Overdue' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {viewInvoice.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Issue Date</p>
                  <p className="font-semibold text-slate-700">{new Date(viewInvoice.issueDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
                <p className="font-bold text-slate-800 text-lg">{viewInvoice.clientName}</p>
                {viewInvoice.clientEmail && <p className="text-sm text-gray-500 mt-1">{viewInvoice.clientEmail}</p>}
              </div>

              <table className="w-full text-sm mb-6">
                <thead className="border-b-2 border-gray-100">
                  <tr>
                    <th className="text-left py-3 font-semibold text-gray-600">Description</th>
                    <th className="text-right py-3 font-semibold text-gray-600">Qty</th>
                    <th className="text-right py-3 font-semibold text-gray-600">Price</th>
                    <th className="text-right py-3 font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {viewInvoice.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 text-slate-800">{item.description}</td>
                      <td className="text-right py-3 text-slate-600">{item.quantity}</td>
                      <td className="text-right py-3 text-slate-600">₹{item.price}</td>
                      <td className="text-right py-3 font-medium text-slate-800">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end text-sm">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-slate-600"><span className="font-medium">Subtotal</span><span>₹{viewInvoice.subtotal}</span></div>
                  <div className="flex justify-between text-slate-600"><span className="font-medium">Tax</span><span>₹{viewInvoice.tax}</span></div>
                  <div className="flex justify-between text-slate-600"><span className="font-medium">Discount</span><span>₹{viewInvoice.discount}</span></div>
                  <div className="flex justify-between font-bold pt-3 border-t-2 border-gray-100 text-base text-slate-800 mt-2"><span>Total</span><span>₹{viewInvoice.total}</span></div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setViewInvoice(null)} className="px-4 py-2 font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">Close</button>
              <button onClick={() => handleDownload(viewInvoice.invoiceNo, viewInvoice._id)} className="px-4 py-2 font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2 shadow-sm">
                <Download size={16}/> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
