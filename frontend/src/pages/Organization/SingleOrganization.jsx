import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaSave } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import useFetchResponse from "../../hooks/useFetchResponse";

const SingleOrganization = () => {
  const [searchedOrganization, setSearchedOrganization] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [organizationRename, setOrganizationRename] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { organizationId } = useParams();

  const { fetchResponse, fetchResults } = useFetchResponse();

  useEffect(() => {
    fetchResponse(
      `http://localhost:8000/organizations/${organizationId}/workspace`,
      "findAllWorkspaces",
    );
  }, []);

  const navigate = useNavigate();

  const findOrganizationInDb = async () => {
    try {
      setErrorMessage("");
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setSearchedOrganization(result.findOrganizationInDatabase);
      } else {
        setErrorMessage(result.message || "Failed to load organization details");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Network error loading organization");
    }
  };

  useEffect(() => {
    findOrganizationInDb();
  }, [organizationId]);

  const handleRename = () => {
    setIsEditing((p) => !p);
  };

  const handleSave = async () => {
    if (!organizationRename || organizationRename.trim().length < 5) {
      setErrorMessage("Organization name must be at least 5 letters!");
      return;
    }
    if (organizationRename.trim().length > 30) {
      setErrorMessage("Organization name cannot exceed 30 letters!");
      return;
    }

    try {
      setErrorMessage("");
      const response = await fetch(
        `http://localhost:8000/organizations/rename/${organizationId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: organizationRename,
          }),
        },
      );
      const result = await response.json();

      if (result.success) {
        setSearchedOrganization(result.response);
        setIsEditing(false);
      } else {
        setErrorMessage(result.message || "Failed to rename organization");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Error updating organization name");
    }
  };

  const handleDelete = async () => {
    try {
      setErrorMessage("");
      const response = await fetch(
        `http://localhost:8000/organizations/delete/${organizationId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const result = await response.json();

      if (result.success) {
        navigate("/organizations");
      } else {
        setErrorMessage(result.message || "Failed to delete organization");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Error deleting organization");
    }
  };

  const handleCreateWorkspace = () => {
    navigate(`/organizations/${organizationId}/workspace/create`);
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-8 w-full max-w-6xl lg:max-w-7xl mx-auto space-y-6">
      {errorMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-red-600 px-6 py-3 text-white shadow-lg flex items-center gap-3">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="font-bold">×</button>
        </div>
      )}
      <div className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all">
        <FaArrowLeft
          onClick={() => navigate("/organizations")}
          className="cursor-pointer text-base"
        />
        <span onClick={() => navigate("/organizations")} className="text-sm font-medium cursor-pointer">
          Back to Organizations
        </span>
      </div>

      <div className="rounded-2xl bg-white border border-blue-100 p-6 sm:p-8 shadow-sm space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Organization</p>

        <div className="flex justify-between items-center">
          {isEditing ? (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                className="border border-blue-300 rounded-lg px-3 py-1.5 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={organizationRename}
                onChange={(e) => setOrganizationRename(e.target.value)}
              />
              <span className="text-[11px] text-slate-400 font-medium">Min 5, Max 30 letters</span>
            </div>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {searchedOrganization?.name}
            </h1>
          )}
          <div className="flex items-center gap-3 text-slate-500">
            {isEditing ? (
              <FaSave
                onClick={handleSave}
                className="cursor-pointer text-blue-600 hover:text-blue-700 text-lg transition-all"
                title="Save"
              />
            ) : (
              <FaPencilAlt
                onClick={handleRename}
                className="cursor-pointer hover:text-blue-600 text-base transition-all"
                title="Rename"
              />
            )}
            <IoTrashBin
              onClick={handleDelete}
              className="cursor-pointer hover:text-red-600 text-lg transition-all"
              title="Delete Organization"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleCreateWorkspace}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
      >
        + Create Workspace
      </button>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg text-slate-900">
            Workspaces
          </h2>
          <span
            onClick={() => navigate("workspace")}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            View All
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {fetchResults.slice(0, 3).map((response) => (
            <Link
              to={`/organizations/${organizationId}/workspace/${response._id}`}
              className="bg-white border border-blue-100 hover:border-blue-400 hover:shadow-md p-6 rounded-2xl transition-all flex flex-col justify-between space-y-3 group"
              key={response._id}
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-all">{response.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{response?.description || "No description provided."}</p>
              </div>
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                View workspace <FaArrowRight className="text-[10px]" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleOrganization;