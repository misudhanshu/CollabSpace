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
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const result = await response.json();

      setSearchedOrganization(result.findOrganizationInDatabase);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findOrganizationInDb();
  }, [organizationId]);

  const handleRename = () => {
    setIsEditing((p) => !p);
  };

  const handleSave = async () => {
    try {
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
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
      navigate("/organizations");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateWorkspace = () => {
    navigate(`/organizations/${organizationId}/workspace/create`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center gap-2">
        <FaArrowLeft
          onClick={() => navigate("/organizations")}
          className="cursor-pointer hover:text-orange-500"
        />
        <span className="text-sm text-gray-500">Organizations</span>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="mb-1 text-sm text-gray-500">Organization</p>

        <div className="flex justify-between">
          {isEditing ? (
            <input
              type="text"
              className="border"
              value={organizationRename}
              onChange={(e) => setOrganizationRename(e.target.value)}
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-800">
              {searchedOrganization?.name}
            </h1>
          )}
          <div className="flex">
            {isEditing ? (
              <FaSave
                onClick={handleSave}
                className="cursor-pointer mx-[0.5rem] md:mx-[1rem]"
              />
            ) : (
              <FaPencilAlt
                onClick={handleRename}
                className="cursor-pointer mx-[0.5rem] md:mx-[1rem]"
              />
            )}
            <IoTrashBin
              onClick={handleDelete}
              className="cursor-pointer mx-[0.5rem] md:mx-[1rem]"
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleCreateWorkspace}
        className="text-sm font-serif border p-[5%] bg-blue-500 text-white my-[2%] w-[100%] cursor-pointer rounded-xl sm:text-base md:text-lg sm:p-[3%] md:p-[2%]"
      >
        Create Workspace
      </button>
      <div className="flex justify-between">
        <div className="m-[2%] font-semibold flex justify-center sm:justify-start text-sm sm:text-base md:text-lg">
          Top Workspaces
        </div>
        <span
          onClick={() => navigate("workspace")}
          className="text-xs sm:text-base my-[2%] mx-[3%] hover:underline cursor-pointer"
        >
          View All
        </span>
      </div>

      <div className="m-[2%] h-[15rem] gap-[2%] flex flex-col items-center sm:flex-row">
        {fetchResults.slice(0, 3).map((response) => (
          <Link
            to={`/organizations/${organizationId}/workspace/${response._id}`}
            className="list-none h-[100%] cursor-pointer bg-slate-50 p-6 w-full sm:w-[33%] shadow-sm border border-slate-200 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg border border-gray-300 mb-[2%] rounded-lg relative"
            key={response._id}
            response={{ response }}
          >
            <span className="text-xl font-semibold">{response.title}</span>
            <p className="text-gray-500 mt-[2%]">{response?.description}</p>
            <span className="text-xs sm:text-sm text-slate-500 absolute bottom-1 flex gap-2 right-0">
              View workspace <FaArrowRight />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SingleOrganization;