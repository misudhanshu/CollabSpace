import Hero from "../assets/Hero-bg.svg";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import useFetchResponse from "../hooks/useFetchResponse";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const createNewOrganization = () => {
    navigate("/create-form");
  };

  const { fetchResponse, fetchResults } = useFetchResponse();

  useEffect(() => {
    fetchResponse(`http://localhost:8000/organizations/`, "response");
  }, []);
  return (
    <div>
      <div className="mt-[1rem] mx-[2%] h-[10rem] w-[95%] relative">
        <img
          src={Hero}
          className="absolute h-[100%] w-[45%] [@media(min-width:450px)]:w-[15rem] [@media(min-width:450px)]:h-[10rem] sm:w-[30rem] sm:h-[15rem] right-0"
        />
        <div className="z-1 absolute top-[1rem]">
          <h1 className="text-xl py-[5%] font-semibold">Welcome back, 👋</h1>
          <p className="text-gray-500 text-xs my-[2%]">
            Let's build something amazing today!
          </p>
        </div>
      </div>
      <div
        onClick={createNewOrganization}
        className="bg-blue-500 w-[90%] mx-[5%] flex cursor-pointer rounded-lg h-[4.5rem] sm:h-[5rem] lg:h-[5.5rem] xl:h-[6.5rem] py-[2%] text-white"
      >
        <div className="h-[2.5rem] xl:h-[3rem] w-[2.5rem] xl:w-[3rem] rounded-lg bg-white mx-[2%]">
          <span className="text-4xl xl:text-5xl mx-[10%] text-blue-800">+</span>
        </div>
        <div>
          <h1 className="text-xs xl:text-base my-[2%] font-sans font-medium">
            Create New Organization
          </h1>
          <p className="text-xs xl:text-base my-[1%] font-thin">
            Start a new work place for your team
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <h1 className="m-[2%] font-semibold flex justify-center sm:justify-start text-sm sm:text-base md:text-lg">
          Top Organizations
        </h1>
        <span
          onClick={() => navigate("/organizations")}
          className="text-xs sm:text-base my-[2%] mx-[3%] hover:underline cursor-pointer"
        >
          View All
        </span>
      </div>
      <div className="m-[2%] h-[15rem] gap-[2%] flex flex-col items-center sm:flex-row">
        {fetchResults.slice(0, 3).map((response) => (
          <Link
            to={`/organizations/${response._id}`}
            className="list-none h-[100%] cursor-pointer bg-slate-50 p-6 w-full shadow-sm border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg border border-gray-300 mb-[2%] flex justify-between rounded-lg relative"
            key={response._id}
          >
            <span className="text-xl font-semibold tracking-tight text-gray-900">
              {response.name}
            </span>
            <span className="text-xs sm:text-sm text-slate-500 absolute bottom-1 flex gap-2 right-0">
              View organization <FaArrowRight />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
