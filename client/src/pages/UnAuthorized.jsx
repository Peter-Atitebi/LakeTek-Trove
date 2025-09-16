const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500">Unauthorized Access</h1>
      <p className="mt-4 text-gray-600">
        You do not have permission to view this page.
      </p>
    </div>
  );
};

export default Unauthorized;
