import React from 'react';
import useAxios from "../hooks/useAxios";

const GeneratorPage: React.FC = () => {
  const { fetchData, loading, error } = useAxios();

  const handleErrorGeneration = async (code: number) => {
    await fetchData(`/${code}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Error Generator</h1>
      
      {loading && (
        <div className="text-blue-600 font-semibold">Loading...</div>
      )}
      
      {error && (
        <div className="text-red-600 font-semibold bg-red-100 p-3 rounded">
          Error: {error}
        </div>
      )}
      
      <button
        onClick={() => handleErrorGeneration(401)}
        disabled={loading}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50"
      >
        Generate 401 Unauthorized
      </button>
      
      <button
        onClick={() => handleErrorGeneration(400)}
        disabled={loading}
        className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
      >
        Generate 400 Bad Request
      </button>
      
      <button
        onClick={() => handleErrorGeneration(500)}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Generate 500 Server Error
      </button>
      
      <button
        onClick={() => handleErrorGeneration(501)}
        disabled={loading}
        className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
      >
        Generate 501 Not Implemented
      </button>
    </div>
  );
};

export default GeneratorPage;