import { useEffect, useState } from "react";
import {
    fetchSemesters,
    deleteSemester,
} from "../../api/SemesterApi.js";
import SemesterForm from "./SemesterForm.jsx";
import SearchInput from "../Inputs/SearchInput.jsx";
import DataTable from "../DataTable.jsx";
import AddButton from "../Buttons/AddButton.jsx";
import ActionButtons from "../Buttons/ActionButtons.jsx";
import ConfirmModal from "../ConfirmModal.jsx";
import { useTranslation } from "react-i18next";

const SemesterTable = () => {
    const { t } = useTranslation();
    const [semesters, setSemesters] = useState([]);
    const [filters, setFilters] = useState({ search: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    const [showForm, setShowForm] = useState(false);
    const [editingSemesterId, setEditingSemesterId] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [semesterToDelete, setSemesterToDelete] = useState(null);

    useEffect(() => {
        loadSemesters();
    }, []);

    const loadSemesters = () => {
        fetchSemesters()
            .then((res) => {
                let data = res.data;

                // Если пришёл Page из Spring Data
                if (!Array.isArray(data)) {
                    if (Array.isArray(data.content)) {
                        data = data.content;
                    } else {
                        console.warn("API вернул неожиданный формат:", data);
                        data = [];
                    }
                }

                setSemesters(data);
            })
            .catch((err) => {
                console.error(err);
                setSemesters([]);
            });
    };


    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const filteredSemesters = Array.isArray(semesters)
        ? semesters.filter((s) => {
            const name = s.name || "";
            return (
                !filters.search ||
                name.toLowerCase().includes(filters.search.toLowerCase())
            );
        })
        : [];


    const totalPages = Math.ceil(filteredSemesters.length / PAGE_SIZE);
    const paginatedSemesters = filteredSemesters.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const confirmDelete = (id) => {
        setSemesterToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (semesterToDelete !== null) {
            try {
                await deleteSemester(semesterToDelete);
                loadSemesters();
            } catch (e) {
                console.error(e);
                alert(t("delete_error"));
            } finally {
                setShowConfirm(false);
                setSemesterToDelete(null);
            }
        }
    };

    const handleEdit = (id) => {
        setEditingSemesterId(id);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingSemesterId(null);
        setShowForm(true);
    };

    const handleSuccess = () => {
        setShowForm(false);
        setEditingSemesterId(null);
        loadSemesters();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingSemesterId(null);
    };

    const columns = [
        { header: t("name"), accessor: "name" },

        {
            header: t("term"),
            accessor: "term",
            render: termValue => termValue ? t(`terms.${termValue.toLowerCase()}`) : ""
        },

        { header: t("year"), accessor: "year" },
        { header: t("start_date"), accessor: "startDate" },
        { header: t("end_date"), accessor: "endDate" },
        {
            header: t("actions"),
            accessor: "actions",
            render: (_, semester) => (
                <ActionButtons
                    onEdit={() => handleEdit(semester.id)}
                    onDelete={() => confirmDelete(semester.id)}
                />
            ),
        },
    ];


    return (
        <div className="p-6">
            {showForm && (
                <SemesterForm
                    semesterId={editingSemesterId}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <AddButton onClick={handleCreate} />

                <SearchInput
                    value={filters.search}
                    onChange={(val) => handleFilterChange("search", val)}
                    placeholder={t("search_by_semester_name")}
                    className="placeholder-opacity-50"
                />
            </div>

            <h1 className="text-xl text-textPrimary mb-2 opacity-70 dark:text-blue-200">
                {t("semester_list")}
            </h1>

            <DataTable
                columns={columns}
                data={Array.isArray(paginatedSemesters) ? paginatedSemesters : []}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />


            <ConfirmModal
                isOpen={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmDelete}
                title={t("confirm_delete_title")}
                description={t("confirm_delete_description")}
                confirmText={t("delete")}
                cancelText={t("cancel")}
            />
        </div>
    );
};

export default SemesterTable;
