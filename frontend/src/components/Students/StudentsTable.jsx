const StudentTable = ({ students }) => {
    return (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-primary text-textPrimary">
            <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Имя пользователя</th>
                <th className="py-2 px-4 text-left">Номер студента</th>
                <th className="py-2 px-4 text-left">Группа</th>
                <th className="py-2 px-4 text-left">Кредиты</th>
                <th className="py-2 px-4 text-left">Год поступления</th>
            </tr>
            </thead>
            <tbody>
            {students.map((student) => (
                <tr key={student.id} className="border-t hover:bg-blue-50 transition">
                    <td className="py-2 px-4">{student.id}</td>
                    <td className="py-2 px-4">{student.username}</td>
                    <td className="py-2 px-4">{student.studentIdNumber}</td>
                    <td className="py-2 px-4">{student.groupName}</td>
                    <td className="py-2 px-4">{student.totalCredits}</td>
                    <td className="py-2 px-4">{student.admissionYear}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default StudentTable
