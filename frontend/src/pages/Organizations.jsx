import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetchResponse from "../hooks/useFetchResponse";

const Organizations = () => {
  const [inputValue, setInputValue] = useState("");

  const { fetchResponse, fetchResults } = useFetchResponse();


  useEffect(() => {
    fetchResponse(`${import.meta.env.VITE_API_URL}/organizations/`, "response");
  }, []);

  const filteredOrgs = fetchResults.filter((item) =>
    item.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-8 text-slate-900 space-y-8 w-full max-w-6xl lg:max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Organizations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse organizations
          </p>
        </div>
      </div>
      <input
        className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 w-full sm:w-80 focus:border-black shadow-2xs transition-all placeholder:text-slate-400"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search organization..."
      />

      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Organizations</h2>
        {filteredOrgs.length === 0 ? (
          <p className="text-xs text-slate-500">No organizations found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {filteredOrgs.map((response) => (
              <Link
                to={`/organizations/${response._id}`}
                className="list-none cursor-pointer bg-blue-500 border border-gray-300 hover:border-black hover:bg-blue-600 text-sm font-bold text-white p-5 flex justify-between items-center transition-all group"
                key={response._id}
              >
                <span className="text-base font-bold transition-all">
                  {response.name}
                </span>
                <span className="text-xs text-white bg-blue-500 font-semibold px-3 py-2 rounded-lg border border-blue-100">
                  View Organization &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
