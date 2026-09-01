import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDraggable } from "@dnd-kit/react";

const Board = () => {
  const { organizationId, workspaceId } = useParams();
  const [tasks, setTasks] = useState([]);
  const ref = useRef(null);
  const fetchTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}/tasks`,
        {
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.log(result.findAllTasks);
        return;
      }

      setTasks(result.findAllTasks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  return (
    <div className="m-[2%] text-white lg:flex">
      <div className="bg-[#1f1f1f] my-[2%] w-full lg:w-[15rem] mx-[3%] p-[2%] rounded-xl">
        <h1 className="mx-[5%] mt-[2%]">To Do</h1>
        <div className="rounded-md p-[2%] cursor-pointer overflow-y-auto max-h-[66vh]">
          {tasks
            .filter((task) => task.status === "todo")
            .map((task) => (
              <div
                className="bg-[#f8f8f8] text-black mt-[5%] p-[3%] rounded-xl"
                key={task._id}
                ref={ref}
              >
                <h1>{task.title}</h1>
                {task.duedate ? (
                  <>
                    <p className="text-sm mt-[1%] text-gray-500 font-semibold">
                      Due date
                    </p>
                    <p>
                      {new Date(task.duedate)
                        .toLocaleDateString("en-GB")
                        .replaceAll("/", "-")}
                    </p>
                  </>
                ) : (
                  ""
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="bg-[#1f1f1f] my-[2%] w-full lg:w-[15rem] mx-[1%] p-[2%] rounded-xl">
        <h1>In Progress</h1>
        <div className="rounded-md p-[2%] cursor-pointer overflow-y-auto max-h-[66vh]">
          <div className="title"></div>
          <div className="due-date"></div>
        </div>
      </div>
      <div className="bg-[#1f1f1f] my-[2%] w-full lg:w-[15rem] mx-[1%] p-[2%] rounded-xl">
        <h1>In Review</h1>
        <div className="rounded-md p-[2%] cursor-pointer overflow-y-auto max-h-[66vh]">
          <div className="title"></div>
          <div className="due-date"></div>
        </div>
      </div>
      <div className="bg-[#1f1f1f] my-[2%] w-full lg:w-[15rem] mx-[1%] p-[2%] rounded-xl">
        <h1>Done</h1>
        <div className="rounded-md p-[2%] cursor-pointer overflow-y-auto max-h-[66vh]">
          <div className="title"></div>
          <div className="due-date"></div>
        </div>
      </div>
    </div>
  );
};

export default Board;
