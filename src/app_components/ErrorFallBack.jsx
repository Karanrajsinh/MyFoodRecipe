function ErrorFallBack({ error, resetErrorBoundary }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-red-700 bg-[#f1f0f0]">
            <h1 className="mb-4 text-xl font-bold text-red-400 md:text-4xl">Something went wrong</h1>
            <p className="mb-6 text-sm text-center md:text-lg">{error.message}</p>
            <button
                onClick={resetErrorBoundary}
                className="px-4 py-2 text-sm text-white bg-red-400 rounded-full md:text-base hover:bg-opacity-90"
            >
                Go To Home
            </button>
        </div>
    );
}

export default ErrorFallBack
