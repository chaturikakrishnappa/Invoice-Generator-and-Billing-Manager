import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Download, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const InvoiceCreate = () => {
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Math.floor(Math.random() * 10000)}`);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, price: 0, total: 0 }
  ]);
  
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount - Number(discount);
    return { subtotal, taxAmount, grandTotal };
  };

  const { subtotal, taxAmount, grandTotal } = calculateTotals();

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0, total: 0 }]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.price);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleSave = async (status = 'Unpaid') => {
    setLoading(true);
    try {
      let clientId = null;
      if (clientName && clientEmail) {
         try {
           const clientRes = await api.post('/clients', { name: clientName, email: clientEmail, phone: clientPhone });
           clientId = clientRes.data.client._id;
         } catch (e) {
           console.log("Client might exist, ignoring error");
         }
      }

      const invoiceData = {
        invoiceNo,
        clientId,
        clientName,
        clientEmail,
        clientPhone,
        items,
        subtotal,
        tax: taxAmount,
        discount: Number(discount),
        total: grandTotal,
        status,
        issueDate,
        dueDate,
        notes
      };

      await api.post('/invoices', invoiceData);
      toast.success('Invoice saved successfully!');
      navigate('/invoices');
    } catch (error) {
      console.error('Failed to save invoice', error);
      toast.error('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      toast.loading('Generating PDF...', { id: 'download' });
      const element = invoiceRef.current;
      const dataUrl = await toPng(element, { pixelRatio: 2, backgroundColor: '#ffffff' });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNo}.pdf`);
      toast.success('PDF Downloaded!', { id: 'download' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF', { id: 'download' });
    }
  };

  const downloadImage = async () => {
    try {
      toast.loading('Generating Image...', { id: 'download' });
      const element = invoiceRef.current;
      const dataUrl = await toPng(element, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `${invoiceNo}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Image Downloaded!', { id: 'download' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate Image', { id: 'download' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Create Invoice</h1>
          <p className="text-gray-500 text-sm mt-0.5">Fill in the details to generate a new invoice.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={ImageIcon} onClick={downloadImage}>
            Image
          </Button>
          <Button variant="secondary" icon={Download} onClick={downloadPDF}>
            PDF
          </Button>
          <Button icon={Save} onClick={() => handleSave('Unpaid')} loading={loading}>
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div ref={invoiceRef} className="bg-white p-6 md:p-10 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-100">
              <div>
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                  <span className="text-white font-bold text-lg">I+</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800">InvoicePro</h2>
                <p className="text-gray-500 text-sm mt-1">123 Business Avenue<br/>Tech District, NY 10001<br/>contact@invoicepro.com</p>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-light text-slate-800 mb-2">INVOICE</h1>
                <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
                  <span className="font-medium text-slate-800">#</span>
                  <input 
                    type="text" 
                    value={invoiceNo} 
                    onChange={e => setInvoiceNo(e.target.value)}
                    className="w-24 text-right bg-transparent border-b border-transparent hover:border-gray-300 focus:border-emerald-500 outline-none transition-colors font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bill To:</h3>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Client Name" 
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-emerald-500 rounded-md text-sm outline-none transition-all font-medium text-slate-800 placeholder-gray-400"
                  />
                  <input 
                    type="email" 
                    placeholder="Client Email" 
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-emerald-500 rounded-md text-sm outline-none transition-all text-gray-600 placeholder-gray-400"
                  />
                  <input 
                    type="tel" 
                    placeholder="Client Phone (optional)" 
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-emerald-500 rounded-md text-sm outline-none transition-all text-gray-600 placeholder-gray-400"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Issue Date:</span>
                  <input 
                    type="date" 
                    value={issueDate}
                    onChange={e => setIssueDate(e.target.value)}
                    className="w-36 px-2 py-1 bg-transparent text-right font-medium text-slate-800 outline-none cursor-pointer hover:bg-gray-50 rounded"
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Due Date:</span>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-36 px-2 py-1 bg-transparent text-right font-medium text-slate-800 outline-none cursor-pointer hover:bg-gray-50 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <div className="space-y-2 mt-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center group">
                    <div className="col-span-6">
                      <input 
                        type="text" 
                        placeholder="Item description" 
                        value={item.description}
                        onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-transparent group-hover:border-gray-200 focus:bg-white focus:border-emerald-500 rounded-md text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantity}
                        onChange={e => handleItemChange(item.id, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-transparent group-hover:border-gray-200 focus:bg-white focus:border-emerald-500 rounded-md text-sm text-center outline-none transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="number" 
                        min="0" 
                        value={item.price}
                        onChange={e => handleItemChange(item.id, 'price', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-transparent group-hover:border-gray-200 focus:bg-white focus:border-emerald-500 rounded-md text-sm text-right outline-none transition-all"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end items-center gap-2">
                      <span className="font-medium text-slate-800 text-sm">₹{item.total.toLocaleString()}</span>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleAddItem}
                className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <Plus size={16} /> Add Line Item
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-6 border-t border-gray-100">
              <div className="w-full md:w-1/2 space-y-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes / Terms</label>
                <textarea 
                  placeholder="Thank you for your business..." 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 rounded-md text-sm outline-none transition-all min-h-[100px] resize-none text-gray-600"
                ></textarea>
              </div>
              
              <div className="w-full md:w-1/3 space-y-3">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span className="flex items-center gap-2">Tax Rate (%)</span>
                  <input 
                    type="number" 
                    min="0" max="100" 
                    value={taxRate}
                    onChange={e => setTaxRate(e.target.value)}
                    className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-right outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Discount (₹)</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={discount}
                    onChange={e => setDiscount(e.target.value)}
                    className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-right outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-3">
                  <span className="font-bold text-slate-800 text-base">Total</span>
                  <span className="font-bold text-emerald-600 text-lg flex items-center gap-1">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-100">Invoice Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-emerald-500">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div className="pt-2">
                <Button className="w-full" icon={Save} onClick={() => handleSave('Paid')} variant="secondary">
                  Mark as Paid & Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreate;
