
import NewsFormComp from "../components/News/NewsForm.jsx";
import StudentNewsComp from "../components/News/StudentNews.jsx";

// Вставлена ваша ссылка Telegram:
const TELEGRAM_URL = "https://t.me/kkc_lms_bot?utm_source=chatgpt.com";

const News = () => {
    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Новостная лента</h1>
                <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" className="w-5 h-5 fill-current">
                        <path d="M20 120c0-55.228 44.772-100 100-100s100 44.772 100 100-44.772 100-100 100S20 175.228 20 120z" fill="none"/>
                        <path d="M34.6 114.4l34.2-12.8c2.3-.9 4.6-.4 6.2 1.2l17.3 16.1c.7.6 1.6.9 2.5.8l38.4-4.6c3.7-.4 6.7 3.1 5.1 6.4L136 183c-1.3 3.1-5.3 4.1-7.9 1.8l-22.9-19.9c-2.7-2.3-6.7-1.8-8.7 1l-12.4 16.2c-2.3 3-7.1 3.3-9.8.6L28.2 147c-3-2.8-1.6-8.1 2.4-9.6l4-1.3z" />
                    </svg>
                    <span className="text-sm">Открыть в Telegram</span>
                </a>
            </div>

            <NewsFormComp />
            <StudentNewsComp />
        </div>
    );
};

export default News;
