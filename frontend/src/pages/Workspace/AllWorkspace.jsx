import { Link, useParams } from "react-router-dom";
import useFetchResponse from "../../hooks/useFetchResponse";
import { useEffect, useState } from "react";

const AllWorkspace = () => {
  const { fetchResponse, fetchResults } = useFetchResponse();
  const [inputValue, setInputValue] = useState("");

  const { organizationId } = useParams();

  useEffect(() => {
    fetchResponse(
      `http://localhost:8000/organizations/${organizationId}/workspace/`,
      "findAllWorkspaces",
    );
  }, []);

  const filteredResults = fetchResults.filter((item) =>
    inputValue.trim()
      ? item.title.toLowerCase().includes(inputValue.toLowerCase())
      : fetchResults,
  );

  return (
    <div>
      <input
        className="border my-[1%] mx-[30%] w-[30%] p-[1%]"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter workspace name"
      />
      <div className="m-[2%] text-white overflow-auto max-h-[calc(100vh-150px)]">
        {filteredResults.map((response) => (
          <Link
            to={`/organizations/${organizationId}/workspace/${response._id}`}
            key={response._id}
            className="list-none cursor-pointer h-[10%] bg-[#2b7fff] hover:bg-blue-700 text-md w-full mb-[4%] p-[3%] flex justify-between"
          >
            <span className="text-xl font-semibold">{response.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllWorkspace;
