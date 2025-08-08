// src/components/sales/Invoice.jsx
import React from 'react';
import Table from '../common/Table';

const Invoice = ({ salesOrder }) => {
  if (!salesOrder) {
    return <div className="card">No sales order data provided.</div>;
  }

  const columns = [
    { header: 'Product', accessor: 'product.name' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Price', accessor: 'price' },
    { header: 'Total', accessor: 'total' },
  ];

  return (
    <div className="card">
      <h3 className="card-heading">Invoice for Sales Order #{salesOrder.orderId}</h3>
      <div className="invoice-header">
        <p><strong>Customer:</strong> {salesOrder.customerName}</p>
        <p><strong>Date:</strong> {salesOrder.date}</p>
      </div>
      <Table columns={columns} data={salesOrder.items} />
      <div className="invoice-footer">
        <p><strong>Subtotal:</strong> ${salesOrder.subtotal}</p>
        <p><strong>Tax:</strong> ${salesOrder.tax}</p>
        <p><strong>Total:</strong> ${salesOrder.total}</p>
      </div>
    </div>
  );
};

export default Invoice;
