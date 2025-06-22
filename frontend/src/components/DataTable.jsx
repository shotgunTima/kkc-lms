const DataTable = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse rounded-xl overflow-hidden shadow-lg bg-tableColor">
                <thead>
                <tr className="bg-bgSecondary text-white text-sm uppercase">
                    {columns.map((col, idx) => (
                        <th key={idx} className="p-3 text-left border-l border-l-blue-900">
                            {col.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.length > 0 ? (
                    data.map((item, rowIndex) => (
                        <tr
                            key={item.id || rowIndex}
                            className="hover:bg-gray-300 transition-colors duration-200 text-sm"
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="p-3 border border-gray-300 text-textPrimary text-left">
                                    {col.render
                                        ? col.render(item[col.accessor], item)
                                        : item[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} className="p-4 text-center text-gray-700 bg-tableColor">
                            Нет данных :'(
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
