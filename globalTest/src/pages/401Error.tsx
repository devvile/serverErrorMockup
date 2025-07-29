import { Link } from 'react-router-dom';

const ErrorPage401 = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6 text-center">
      <h1 className="text-5xl font-bold text-red-600">401</h1>
      <h2 className="text-2xl mt-4 text-gray-800">Auth failed</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        You don't have permission to access this resource. An unexpected error occurred on the server.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default ErrorPage401;
