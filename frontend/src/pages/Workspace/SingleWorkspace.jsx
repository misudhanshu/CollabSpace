import { useEffect, useState } from "react";
import useFetchResponse from "../../hooks/useFetchResponse";
import { NavLink, useParams } from "react-router-dom";
import Board from "../../components/Board/Board";

const SingleWorkspace = () => {
  const { fetchResponse, fetchResults } = useFetchResponse();
  const { organizationId, workspaceId } = useParams();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchResponse(
      `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}`,
      "findTheWorkspace",
    );
  }, []);

  return (
    <div>
      <h1 className="m-[2%] font-semibold sm:text-lg xl:text-2xl flex gap-[1%]">
        {fetchResults.title}
      </h1>
      <hr />
      <ul className="mt-[2%] sm:mt-[1%] xl:mt-0 mx-[2%] py-[2%] h-[2.5rem] gap-[5%] xl:gap-[2%] text-sm flex  cursor-pointer">
        <NavLink
          onClick={() => setIsActive(true)}
          className={
            isActive
              ? "text-blue-500 underline decoration-blue-500"
              : "text-black no-underline"
          }
        >
          Board
        </NavLink>
        <NavLink
          onClick={() => setIsActive(false)}
          className={
            isActive
              ? "text-black no-underline"
              : "text-blue-500 underline decoration-blue-500"
          }
        >
          Members
        </NavLink>
      </ul>
      {isActive ? <Board /> : ""}
    </div>
  );
};

export default SingleWorkspace;
