// src/components/common/Table.jsx
import React from 'react';

const Table = ({ columns, data }) => {
  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead className="table-header">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="table-cell">{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.length === 0 ? (
            <tr>
              <td className="table-cell" colSpan={columns.length} style={{ textAlign: 'center' }}>
                No data available.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="table-row">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="table-cell">
                    {row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
