import NewsForm from "../components/News/NewsForm.jsx";
import StudentNews from "../components/News/StudentNews.jsx";

const News = () => {
    return (
        <div className="flex flex-col gap-6">
            <NewsForm />
            <StudentNews />
        </div>
    );
};

export default News;
