
import NewsForm from "../components/News/NewsForm";
import StudentNews from "../components/News/StudentNews";
import { useAuth } from "../hooks/useAuth";

export default function NewsPage() {
    const { role } = useAuth();

    return (
        <div className="p-6 space-y-6">
            {role === "ADMIN" && <NewsForm />}
            {role === "STUDENT" && <StudentNews />}
        </div>
    );
}
