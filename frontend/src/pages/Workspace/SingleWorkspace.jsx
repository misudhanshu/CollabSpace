import { useEffect, useState } from "react";
import useFetchResponse from "../../hooks/useFetchResponse";
import { useParams } from "react-router-dom";
import Board from "../../components/Board/Board";
import Members from "../../components/Members/Members";
import AdminDashboard from "../../components/AdminDashboard/AdminDashboard";

const SingleWorkspace = () => {
  const { fetchResponse, fetchResults } = useFetchResponse();
  const { organizationId, workspaceId } = useParams();
  const [activeTab, setActiveTab] = useState("board");
  const [currentUser, setCurrentUser] = useState(null);

  const loadWorkspace = () => {
    fetchResponse(
      `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}`,
      "findTheWorkspace",
    );
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/profile", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success && data.response) {
        setCurrentUser(data.response);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    loadWorkspace();
    fetchProfile();
  }, [organizationId, workspaceId]);

  const owner = fetchResults?.organization?.owner;
  const isAdmin =
    currentUser &&
    owner &&
    (currentUser._id === owner._id ||
      currentUser.username === owner.username ||
      currentUser._id === owner);

  return (
    <div className="h-full flex flex-col min-h-0 overflow-auto lg:overflow-hidden bg-slate-50">
      <div className="flex-shrink-0 px-6 pt-5 pb-3 bg-white border-b border-blue-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-extrabold text-xl xl:text-2xl text-slate-900 tracking-tight">
            {fetchResults.title || "Workspace"}
          </h1>
          {fetchResults?.organization?.name && (
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-semibold">
              Org: {fetchResults.organization.name}
            </span>
          )}
        </div>

        <ul className="text-sm flex gap-6 sm:gap-8 cursor-pointer font-semibold border-t border-slate-100 pt-3 overflow-x-auto whitespace-nowrap no-scrollbar">
          <li
            onClick={() => setActiveTab("board")}
            className={`pb-1 border-b-2 transition-all ${
              activeTab === "board"
                ? "text-blue-600 border-blue-600 font-bold"
                : "text-slate-500 border-transparent hover:text-slate-900"
            }`}
          >
            Board
          </li>
          <li
            onClick={() => setActiveTab("members")}
            className={`pb-1 border-b-2 transition-all ${
              activeTab === "members"
                ? "text-blue-600 border-blue-600 font-bold"
                : "text-slate-500 border-transparent hover:text-slate-900"
            }`}
          >
            Members
          </li>
          {isAdmin && (
            <li
              onClick={() => setActiveTab("admin")}
              className={`pb-1 border-b-2 transition-all ${
                activeTab === "admin"
                  ? "text-blue-600 border-blue-600 font-bold"
                  : "text-slate-500 border-transparent hover:text-slate-900"
              }`}
            >
              Admin Dashboard
            </li>
          )}
        </ul>
      </div>

      <div className="flex-1 min-h-0 overflow-auto lg:overflow-hidden">
        {activeTab === "board" && <Board />}
        {activeTab === "members" && <Members workspace={fetchResults} />}
        {activeTab === "admin" && isAdmin && (
          <AdminDashboard
            workspace={fetchResults}
            onRefreshWorkspace={loadWorkspace}
          />
        )}
      </div>
    </div>
  );
};

export default SingleWorkspace;
