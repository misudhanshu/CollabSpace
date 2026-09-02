import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  FaPlus,
  FaUsers,
  FaBuilding,
  FaArrowRight,
  FaUserTie,
} from "react-icons/fa";
import useFetchResponse from "../hooks/useFetchResponse";

const Home = () => {
  const navigate = useNavigate();
  const [myWorkspaces, setMyWorkspaces] = useState([]);
  const { fetchResponse, fetchResults } = useFetchResponse();
  const { organizationId } = useParams();

  const fetchMyWorkspaces = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}/workspace/user/my-workspaces`,
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
    fetchResponse("http://localhost:8000/organizations/", "response");
    fetchMyWorkspaces();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 min-h-full">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Welcome to CollabSpace
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          What would you like to do today?
        </p>
      </div>

      {/* Split Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* OPTION 1: CREATE YOUR OWN ORGANIZATION */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-start shadow-sm hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xl font-bold text-blue-600">
              <FaBuilding />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Create Your Own Organization
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Create an organization, set up workspaces, and start leading your project teams.
              </p>
            </div>
            <button
              onClick={() => navigate("/create-form")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm text-sm cursor-pointer"
            >
              <FaPlus className="text-xs" /> Get Started
            </button>
          </div>

          {/* Existing Owned Organizations List */}
          {fetchResults && fetchResults.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs font-bold text-blue-600 uppercase tracking-wider">
                <span>My Organizations ({fetchResults.length})</span>
                <Link
                  to="/organizations"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {fetchResults.map((org) => (
                  <Link
                    to={`/organizations/${org._id}`}
                    key={org._id}
                    className="bg-blue-50/50 hover:bg-blue-100/60 border border-blue-100 p-3.5 rounded-xl flex items-center justify-between text-sm transition-all shadow-2xs"
                  >
                    <span className="font-semibold text-slate-800">
                      {org.name}
                    </span>
                    <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                      Open <FaArrowRight className="text-[10px]" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* OPTION 2: WORK WITH OTHERS */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-start shadow-sm hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center text-xl font-bold">
              <FaUsers />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Work With Others
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Access workspaces created by other organization leaders and collaborate.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            {myWorkspaces && myWorkspaces.length > 0 ? (
              <div className="space-y-3 w-full">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Invited Organizations & Workspaces ({myWorkspaces.length})
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {myWorkspaces.map((workspace) => {
                    const orgId =
                      workspace.organization?._id || workspace.organization;
                    const orgName =
                      workspace.organization?.name ||
                      "CollabSpace Organization";
                    const ownerName =
                      workspace.organization?.owner?.username ||
                      "Workspace Owner";

                    return (
                      <div
                        key={workspace._id}
                        className="bg-blue-50/40 border border-blue-100 p-4 rounded-xl space-y-3 hover:border-blue-300 transition-all shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                              Invited Organization
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium">
                              <FaUserTie className="text-[10px]" /> Owner:{" "}
                              {ownerName}
                            </span>
                          </div>
                          <h3 className="font-bold text-base text-slate-900">
                            {orgName}
                          </h3>
                          <div className="text-xs text-slate-600 flex items-center gap-1">
                            <span className="text-slate-500">Workspace:</span>
                            <span className="font-semibold text-slate-800">
                              {workspace.title}
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/organizations/${orgId}/workspace/${workspace._id}`}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all text-xs shadow-sm"
                        >
                          View Workspace &rarr;
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50/30 border border-blue-100 p-6 rounded-xl text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  No shared workspaces yet
                </p>
                <p className="text-xs text-slate-500">
                  Ask a workspace owner to add you to their workspace.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
