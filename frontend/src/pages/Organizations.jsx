import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetchResponse from "../hooks/useFetchResponse";

const Organizations = () => {
  const [inputValue, setInputValue] = useState("");

  const { fetchResponse, fetchResults } = useFetchResponse();

  useEffect(() => {
    fetchResponse(`http://localhost:8000/organizations/`, "response");
  }, []);

  const filteredResults = fetchResults.filter((item) =>
    item.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div>
      <input
        className="border my-[1%] mx-[30%] w-[30%] p-[1%]"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter organization name"
      />
      <div className="m-[2%] text-white overflow-auto max-h-[calc(100vh-150px)]">
        {filteredResults.map((response) => (
          <Link
            to={`/organizations/${response._id}`}
            className="list-none cursor-pointer h-[10%] bg-[#2b7fff] hover:bg-blue-700 text-md w-full mb-[4%] p-[3%] flex justify-between"
            key={response._id}
          >
            {response.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Organizations;
