import { changeInvoiceStatus } from '../services/invoiceService';

export default function InvoiceRow({ invoice, onEdit, onDelete, onRefresh }) {
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    let paymentDate = null;

    if (newStatus === 'paid') {
        paymentDate = prompt('Enter payment date (YYYY-MM-DD)');

        if (!paymentDate) {
        alert('Payment date is required');
        return;
        }
    }

    await changeInvoiceStatus(invoice._id, newStatus, paymentDate);
    onRefresh();
  };

  return (
    <tr>
      <td>{invoice._id}</td>
      <td>{invoice.customerName}</td>
      <td>${invoice.finalPrice?.toFixed(2)}</td>

      <td>
        <select value={invoice.status} onChange={handleStatusChange}>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
        </select>
      </td>
      <td>
        {invoice.paymentDate && invoice.status === 'paid' 
        ? invoice.paymentDate.split('-').reverse().join('/')
        : '-'}
      </td>
      <td>
        {invoice.status !== 'cancelled' && (
            <>
            <button onClick={() => onEdit(invoice)}>Edit</button>
            <button onClick={() => onDelete(invoice._id)}>Delete</button>
            </>
        )}
      </td>

    </tr>
  );
}
