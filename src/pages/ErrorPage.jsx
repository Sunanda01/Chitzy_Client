import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="h-[calc(100vh-64px)] mt-16 ">
       <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Page Not Found</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition duration-300 rounded"
        >
          Go Home
        </Link>
      </div>
    </div>
    </div>
  );
}

export default ErrorPage;
