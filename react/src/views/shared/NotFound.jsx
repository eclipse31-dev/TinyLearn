import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <p className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
            Go to Dashboard
          </Link>
          <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}