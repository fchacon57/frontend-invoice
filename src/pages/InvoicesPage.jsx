import { useEffect, useState } from 'react';
import InvoiceList from '../components/InvoiceList';
import InvoiceModal from '../components/InvoiceModal';
import {
  getInvoices,
  deleteInvoiceById,
} from '../services/invoiceService';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null); // 👈 limpiar error previo
      const data = await getInvoices();
      setInvoices(data);
    } catch (err) {
      setError(err.message || 'Error loading invoices');
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this invoice?'
    );

    if (!confirmed) return;

    try {
      await deleteInvoiceById(id);
      fetchInvoices();
    } catch (err) {
      alert(err.message || 'Error deleting invoice');
    }
  };

  const openCreateModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(true);
  };

  const openEditModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Invoices</h1>

      <button onClick={openCreateModal}>Create Invoice</button>

      <InvoiceList
        invoices={invoices}
        onEdit={openEditModal}
        onDelete={deleteInvoice}
        onRefresh={fetchInvoices}   
      />

      {isModalOpen && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={closeModal}
          onSaved={fetchInvoices}
        />
      )}
    </div>
  );
}
