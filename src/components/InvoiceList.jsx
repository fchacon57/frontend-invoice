import InvoiceRow from './InvoiceRow';

export default function InvoiceList({ invoices, onEdit, onDelete, onRefresh }) {
  if (invoices.length === 0) {
    return <p>No invoices found.</p>;
  }

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
          <th>Payment Date</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {invoices.map((invoice) => (
          <InvoiceRow
            key={invoice._id}
            invoice={invoice}
            onEdit={onEdit}
            onDelete={onDelete}
            onRefresh={onRefresh}   // 👈 CLAVE
          />
        ))}
      </tbody>
    </table>
  );
}
