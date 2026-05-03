import { useEffect, useState } from 'react';
import { Plus, Search, User, Trash2 } from 'lucide-react';
import api from '../services/api';
import Table from '../components/Table';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddClient = async (e) => {
    e.preventDefault();
    
    // Validate Phone number (only numbers, exactly 10 digits)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    setSaving(true);
    try {
      await api.post('/clients', formData);
      toast.success('Client added successfully');
      setFormData({ name: '', email: '', phone: '', address: '' });
      setShowAddForm(false);
      fetchClients();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add client');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this client?")) {
      try {
        await api.delete(`/clients/${id}`);
        toast.success("Client deleted");
        fetchClients();
      } catch (error) {
        toast.error("Failed to delete client");
      }
    }
  };

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { label: 'Client Name' },
    { label: 'Email' },
    { label: 'Phone' },
    { label: 'Date Added' },
    { label: 'Actions', align: 'right' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Clients</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your customer directory</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Client'}
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddClient} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input type="tel" maxLength="10" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-emerald-500 outline-none" placeholder="10-digit number" />
          </div>
          <div className="flex items-end">
            <Button type="submit" loading={saving} className="w-full">Save Client</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search clients..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div></div>
        ) : (
          <Table columns={columns}>
            {filteredClients.map((client) => (
              <tr key={client._id} className="hover:bg-slate-50 text-sm">
                <td className="px-3 py-2 font-medium text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center"><User size={14} /></div>
                  {client.name}
                </td>
                <td className="px-3 py-2 text-gray-600">{client.email}</td>
                <td className="px-3 py-2 text-gray-600">{client.phone || '-'}</td>
                <td className="px-3 py-2 text-gray-600">{new Date(client.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => handleDelete(client._id)} className="text-gray-400 hover:text-red-500 p-1">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr><td colSpan="5" className="px-3 py-8 text-center text-sm text-gray-500">No clients found.</td></tr>
            )}
          </Table>
        )}
      </div>
    </div>
  );
};

export default Clients;
