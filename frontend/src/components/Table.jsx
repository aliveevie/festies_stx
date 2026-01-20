import { motion } from 'framer-motion';

/**
 * Beautiful Table Component
 * Data table with sorting and styling
 */
const Table = ({
  columns,
  data,
  onRowClick,
  className = "",
  striped = false,
  hover = true,
}) => {
  return (
    <div className={`overflow-x-auto rounded-xl border-2 border-gray-200 ${className}`}>
      <table className="w-full">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              className={`
                ${striped && rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                ${hover ? 'hover:bg-blue-50 cursor-pointer' : ''}
                transition-colors duration-200
              `}
              onClick={() => onRowClick && onRowClick(row)}
              whileHover={hover ? { scale: 1.01 } : {}}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                >
                  {column.render
                    ? column.render(row[column.accessor], row)
                    : row[column.accessor]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
