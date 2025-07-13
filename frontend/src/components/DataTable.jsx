import { Card, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const DataTable = ({ columns, data }) => {
    const { t } = useTranslation();

    return (
        <Card className="h-full w-full shadow-soft-gray-around">
            <table className="w-full text-left border-separate border-spacing-0 shadow-soft-gray-around">
                <thead>
                <tr>
                    {columns.map((col, idx) => (
                        <th
                            key={idx}
                            className={`border-r border-gray-300 text-white bg-bgSecondary p-4 first:rounded-tl-lg last:rounded-tr-lg 
                                    dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300`}
                        >
                            <Typography
                                variant="small"
                                className="font-normal leading-none"
                            >
                                {t(col.header || col.accessor || `column_${idx + 1}`)}
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
                            className="group relative z-0 bg-tableColor hover:bg-white transition-all duration-150 transform hover:scale-[1.01]
                                    hover:z-10 hover:shadow-soft-gray-around  dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            {columns.map((col, colIndex) => {
                                const value = item[col.accessor];
                                const rendered = col.render ? col.render(value, item) : value;

                                return (
                                    <td
                                        key={colIndex}
                                        className="p-3 border-r border-b border-gray-300 text-left text-sm text-gray-800
                                                transition-colors duration-150 dark:border-gray-600 dark:text-white"
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
                            className="p-4 text-center text-gray-700 bg-tableColor rounded-b-md
                                    dark:bg-gray-700 dark:text-gray-300"
                        >
                            {t("no_data")}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </Card>
    );
};

export default DataTable;
