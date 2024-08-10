import { useNavigate } from "react-router-dom"

function PageNotFound() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-gray-800 bg-[#f1f0f0]">
            <h1 className="mb-4 text-4xl font-extrabold text-red-400 md:text-6xl">404</h1>
            <h2 className="mb-4 text-xl font-semibold text-red-500 md:text-2xl">Page Not Found</h2>
            <p className="mb-6 text-sm text-center md:text-lg text-slate-500">
                Oops! The page you&quot;re looking for doesn&quot;t exist.
            </p>
            <button
                onClick={() => navigate('/')}
                className="px-6 py-3 text-xs text-white bg-red-400 rounded-full md:text-base hover:bg-opacity-90"
            >
                Go to Home
            </button>
        </div>
    )
}

export default PageNotFound
