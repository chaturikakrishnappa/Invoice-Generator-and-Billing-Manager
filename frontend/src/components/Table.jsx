const Table = ({ columns, children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
            {columns.map((col, index) => (
              <th 
                key={index} 
                className={`px-3 py-2 ${col.align === 'right' ? 'text-right' : ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm bg-white">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
