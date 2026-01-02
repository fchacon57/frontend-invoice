const API_URL = `${import.meta.env.VITE_API_URL}/invoices`;

async function handleResponse(res) {
  let json = null;

  try {
    json = await res.json();
  } catch {
    // response sin body (ej: 204)
  }

  if (!res.ok || (json && json.success === false)) {
    throw new Error(json?.message || 'Unexpected API error');
  }

  return json?.data ?? null;
}

// =====================
// Queries
// =====================
export async function getInvoices() {
  const res = await fetch(API_URL);
  return handleResponse(res);
}

// =====================
// Commands
// =====================
export async function createInvoice(invoice) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });

  return handleResponse(res);
}

export async function updateInvoice(invoice) {
  if (!invoice?._id) {
    throw new Error('Invoice ID is required for update');
  }

  const res = await fetch(`${API_URL}/${invoice._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });

  return handleResponse(res);
}

export async function deleteInvoiceById(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  await handleResponse(res);
}

export async function changeInvoiceStatus(id, status, paymentDate) {
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, paymentDate }),
  });

  return handleResponse(res);
}