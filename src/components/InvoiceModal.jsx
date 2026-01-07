import { useEffect, useState } from 'react';
import './InvoiceModal.css';

export default function InvoiceModal({ invoice, onClose, onSaved }) {
  const isEditMode = Boolean(invoice);

  const [form, setForm] = useState({
    customerName: '',
    customerAddress: '',
    sellerName: '',
    sellerAddress: '',
    items: [],
    finalPrice: 0,
    terms: '',
    invoiceDescription: ''
  });

  useEffect(() => {
    if (isEditMode && invoice) {
        const calculatedTotal = calculateTotal(invoice.items || []);
        setForm({
        customerName: invoice.customerName,
        customerAddress: invoice.customerAddress,
        sellerName: invoice.sellerName,
        sellerAddress: invoice.sellerAddress,
        items: invoice.items || [],
        finalPrice: calculatedTotal,
        terms: invoice.terms,
        invoiceDescription: invoice.invoiceDescription
        });
    }
  }, [invoice, isEditMode]);

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode
        ? `${VITE_API_URL}/${invoice._id}`
        : VITE_API_URL;

        const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
        });

        if (!res.ok) throw new Error();

        onSaved();
        onClose();
    } catch {
        alert(url);
        alert('Error saving invoice');
    } finally {
        setIsSaving(false);
    }
  };

  const addItem = () => {
    setForm({
        ...form,
        items: [
        ...form.items,
        {
            description: '',
            quantity: '',
            price: '',
            touched: false   // 👈 CLAVE
        }
        ]
    });
  };

  const removeItem = (index) => {
    setForm({
        ...form,
        items: form.items.filter((_, i) => i !== index)
    });
  };

  const calculateTotal = (items) => {
    return items.reduce(
        (total, item) =>
        total + Number(item.quantity) * Number(item.price),
        0
    );
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];

    let parsedValue = value;

    if (field === 'price' || field === 'quantity') {
        parsedValue = value === '' ? '' : Number(value);
    }

    updatedItems[index] = {
        ...updatedItems[index],
        [field]: parsedValue,
        touched: field === 'price' ? true : updatedItems[index].touched
    };

    setForm({
        ...form,
        items: updatedItems
    });
  };

  const total = form.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const isFormValid =
    form.customerName.trim() &&
    form.customerAddress.trim() &&
    form.sellerName.trim() &&
    form.sellerAddress.trim() &&
    form.items.length > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{isEditMode ? 'Edit Invoice' : 'Create Invoice'}</h2>

        <form onSubmit={handleSubmit}>
          <h3>Customer</h3>  
          <input
            name="customerName"
            placeholder="Customer Name"
            value={form.customerName}
            onChange={handleChange}
            required
          />
          <input
            name="customerAddress"
            placeholder="Customer Address"
            value={form.customerAddress}
            onChange={handleChange}
            required
          />
          <h3>Seller</h3>

          <input
            name="sellerName"
            placeholder="Seller Name"
            value={form.sellerName}
            onChange={handleChange}
            required
          />
          <input
            name="sellerAddress"
            placeholder="Seller Address"
            value={form.sellerAddress}
            onChange={handleChange}
            required
          />

        <h3>Items</h3>

        <table className="invoice-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price Unit</th>
                <th>Subtotal</th>
                <th></th>
            </tr>
        </thead>

        <tbody>
            {form.items.map((item, index) => (
            <tr key={index}>
                <td>
                <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                    handleItemChange(index, 'description', e.target.value)
                    }
                    required
                />
                </td>

                <td>
                <input
                    type="number"
                    min="1"
                    placeholder=""
                    value={item.quantity}
                    onChange={(e) =>
                    handleItemChange(index, 'quantity', e.target.value)
                    }
                    required
                />
                </td>

                <td>
                    <input
                    type="number"
                    min="1"
                    placeholder=""
                    value={item.price}
                    onChange={(e) =>
                        handleItemChange(index, 'price', e.target.value)
                    }
                    className={
                        item.touched && Number(item.price) <= 0 ? 'input-error' : ''
                    }
                    />
                </td>

                <td>
                ${(item.quantity * item.price).toFixed(2)}
                </td>

                <td>
                <button onClick={() => removeItem(index)}>✕</button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>

        <button type="button" onClick={addItem}>
        + Add Item
        </button>

        <h3>Total: ${total.toFixed(2)}</h3>

          <input
            name="terms"
            placeholder="Terms and Conditions"
            value={form.terms}
            onChange={handleChange}
          />

          <input
            name="invoiceDescription"
            placeholder="Invoice Description"
            value={form.invoiceDescription}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit" disabled={isSaving || !isFormValid}>
            {isSaving ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </button>

            <button type="button" onClick={onClose} disabled={isSaving}>
            Cancel
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
