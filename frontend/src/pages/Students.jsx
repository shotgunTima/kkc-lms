import { useEffect, useState } from 'react'
import { fetchStudents, createStudent } from '../api/studentApi'
import StudentTable from '../components/Students/StudentsTable.jsx'


const Students = () => {
    const [students, setStudents] = useState([])

    const loadStudents = async () => {
        try {
            const response = await fetchStudents()
            setStudents(response.data)
        } catch (error) {
            console.error('Ошибка при загрузке студентов', error)
        }
    }

    const handleAddStudent = async (data) => {
        try {
            await createStudent(data)
            await loadStudents()
        } catch (error) {
            alert('Ошибка при создании студента: ' + error.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        loadStudents()
    }, [])

    return (
        <div>
            <StudentTable students={students} />
        </div>
    )
}

export default Students
