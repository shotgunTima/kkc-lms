import { Card, Typography } from "@material-tailwind/react";

const DataTable = ({ columns, data }) => {
    return (
        <Card className="h-full w-full shadow-soft-gray-around">
            <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                <tr>
                    {columns.map((col, idx) => (
                        <th
                            key={idx}
                            className={`border-r border-gray-300 bg-bgSecondary p-4 first:rounded-tl-md last:rounded-tr-md`}
                        >
                            <Typography
                                variant="small"
                                color="white"
                                className="font-normal leading-none"
                            >
                                {col.header || col.accessor || `Колонка ${idx + 1}`}
                            </Typography>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.length > 0 ? (
                    data.map((item, rowIndex) => (
                        <tr
                            key={item.id || rowIndex}
                            className="group relative z-0 bg-tableColor transition-all duration-150 transform hover:scale-[1.01] hover:z-10 hover:shadow-soft-gray-around hover:bg-white"
                        >
                            {columns.map((col, colIndex) => {
                                const value = item[col.accessor];
                                const rendered = col.render ? col.render(value, item) : value;

                                return (
                                    <td
                                        key={colIndex}
                                        className="p-3 border-r border-b border-gray-300 text-left text-sm text-gray-800 transition-colors duration-150"
                                    >
                                        {typeof rendered === "string" || typeof rendered === "number"
                                            ? <span>{rendered}</span>
                                            : rendered}
                                    </td>
                                );
                            })}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="p-4 text-center text-gray-700 bg-tableColor rounded-b-md"
                        >
                            Нет данных.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </Card>
    );
};

export default DataTable;
