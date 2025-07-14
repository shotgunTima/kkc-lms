import { Card, Typography, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import {ChevronLeft, ChevronRight} from "lucide-react";

const PAGE_SIZE = 10;

const DataTable = ({ columns, data }) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / PAGE_SIZE);

    const paginatedData = data.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <Card className="h-full w-full shadow-soft-gray-around dark:bg-gray-900">
            <table className="w-full text-left border-separate border-spacing-0 ">
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
                {paginatedData.length > 0 ? (
                    paginatedData.map((item, rowIndex) => (
                        <tr
                            key={item.id || rowIndex}
                            className="group relative z-0 bg-blue-50 hover:bg-white/10 hover:bg-blur-lg transition-all duration-150 transform hover:scale-[1.01]
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
                                        {typeof rendered === "string" || typeof rendered === "number" ? (
                                            <span>{rendered}</span>
                                        ) : (
                                            rendered
                                        )}
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

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 my-5">
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
                 bg-bgSecondary text-white hover:bg-opacity-90
                 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
                 disabled:opacity-70 disabled:cursor-not-allowed "
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>

                    {[...Array(totalPages)].map((_, i) => {
                        const isActive = currentPage === i + 1;
                        return (
                            <Button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium 
                      transition-all duration-300 shadow-none
                      ${
                                    isActive
                                        ? " text-textPrimary hover:bg-gray-200 dark:text-blue-300 dark:hover:bg-gray-600 "
                                        : "text-gray-400 hover:bg-gray-200  dark:text-gray-200 dark:hover:bg-gray-600 "
                                }`}
                            >
                                {i + 1}
                            </Button>
                        );
                    })}

                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
                 bg-bgSecondary text-white hover:bg-opacity-90
                 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
                 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </Button>
                </div>
            )}

        </Card>
    );
};

export default DataTable;
