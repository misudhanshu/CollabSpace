import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetchResponse from "../hooks/useFetchResponse";

const Organizations = () => {
  const [inputValue, setInputValue] = useState("");
  const [myWorkspaces, setMyWorkspaces] = useState([]);

  const { fetchResponse, fetchResults } = useFetchResponse();

  const fetchMyWorkspaces = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/organizations/user/my-workspaces",
        { credentials: "include" },
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setMyWorkspaces(data.workspaces || []);
      }
    } catch (error) {
      console.error("Error fetching user workspaces:", error);
    }
  };

  useEffect(() => {
    fetchResponse(`http://localhost:8000/organizations/`, "response");
    fetchMyWorkspaces();
  }, []);

  const filteredOrgs = fetchResults.filter((item) =>
    item.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const filteredWorkspaces = myWorkspaces.filter((w) =>
    w.title.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-8 text-slate-900 space-y-8 w-full max-w-6xl lg:max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Workspaces & Organizations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your workspaces directly or browse organizations
          </p>
        </div>
        <input
          className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 w-full sm:w-80 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs transition-all placeholder:text-slate-400"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search workspace or organization..."
        />
      </div>

      {/* Direct Workspaces Listing */}
      {myWorkspaces.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Joined Workspaces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredWorkspaces.map((workspace) => {
              const orgId =
                workspace.organization?._id || workspace.organization;
              return (
                <Link
                  to={`/organizations/${orgId}/workspace/${workspace._id}`}
                  key={workspace._id}
                  className="bg-white text-slate-900 p-5 rounded-2xl border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all block space-y-2 group"
                >
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-all">{workspace.title}</h3>
                  <p className="text-xs text-slate-500">
                    Organization: {workspace.organization?.name || "CollabSpace"}
                  </p>
                  <span className="text-xs text-blue-600 font-semibold inline-flex items-center gap-1 pt-1">
                    Open Workspace Board &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Organizations Listing */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Organizations</h2>
        {filteredOrgs.length === 0 ? (
          <p className="text-xs text-slate-500">No organizations found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrgs.map((response) => (
              <Link
                to={`/organizations/${response._id}`}
                className="list-none cursor-pointer bg-white border border-blue-100 hover:border-blue-400 hover:shadow-md text-sm font-bold text-slate-900 rounded-2xl p-5 flex justify-between items-center transition-all group"
                key={response._id}
              >
                <span className="group-hover:text-blue-600 text-base font-bold transition-all">{response.name}</span>
                <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">View Organization &rarr;</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
