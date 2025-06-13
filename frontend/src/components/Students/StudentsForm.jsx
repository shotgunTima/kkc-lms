import { useState } from 'react'

const StudentForm = ({ onSubmit }) => {
    const [form, setForm] = useState({
        userId: '',
        studentIdNumber: '',
        groupId: '',
        totalCredits: '',
        admissionYear: '',
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Submit called', form);

        onSubmit(form)
        setForm({
            userId: '',
            studentIdNumber: '',
            groupId: '',
            totalCredits: '',
            admissionYear: '',
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 shadow-md rounded-lg mb-6"
        >
            <h3 className="text-xl font-semibold mb-4 text-textPrimary">
                Добавить студента
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <input
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="ID пользователя"
                    required
                />
                <input
                    name="studentIdNumber"
                    value={form.studentIdNumber}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="Номер студента"
                    required
                />
                <input
                    name="groupId"
                    value={form.groupId}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    placeholder="ID группы"
                    required
                />
                <input
                    name="totalCredits"
                    value={form.totalCredits}
                    onChange={handleChange}
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Кредиты"
                    required
                />
                <input
                    name="admissionYear"
                    value={form.admissionYear}
                    onChange={handleChange}
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Год поступления"
                    required
                />
            </div>
            <button
                type="submit"
                className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-blue-600 transition"
            >
                Сохранить
            </button>
        </form>
    )
}

export default StudentForm
