import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const CreatingWorkspace = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { organizationId } = useParams();

  const onSubmit = async (data) => {
    const response = await fetch(
      `http://localhost:8000/organizations/${organizationId}/workspace/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          description: data.description,
        }),
      },
    );
    console.log(response);
    if (response.ok) {
      const result = await response.json();
      setSuccessMessage("Workspace created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } else {
      console.log("Failed to fetch!");
    }
  };

  return (
    <>
      {successMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-lg bg-green-600 px-6 py-3 text-white shadow-lg animate-[toast-in-out_5s_ease-in-out_forwards]">
          {successMessage}
        </div>
      )}
      <h1 className="text-xl font-bold flex justify-center mt-[2%] mb-[5%]">
        Workspace Form
      </h1>
      <form
        className="h-[50vh] sm:h-[60vh] lg:h-[70vh] w-[90%] border border-gray-300 rounded-lg mx-[5%] my-[10%] lg:my-[5%] p-[2%]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mx-[2%]">Title:</label>
        <input
          className="mt-[2%] p-[2%] w-[70%] border"
          {...register("title", { required: "Enter the title", minLength: 5, maxLength: 15 })}
          type="text"
        />
        <br />
        <label className="mt-[5%]">Description:</label>
        <textarea
          className="mt-[2%] p-[2%] w-[100%] text-sm h-[40%] border"
          {...register("description")}
          type="text"
          placeholder="Optional..."
        />
        <button className="border text-base mt-[2%] mx-[10%] w-[80%] rounded-lg md:rounded-2xl p-[5%] bg-blue-500 text-white sm:w-[90%] md:w-[91%] xl:w-[95%] bg-blue-600 py-3 text-white mx-[4.5%] sm:mx-[2.5%] md:mx-[2%] lg:mx-[1%] p-[0.5rem] xl:py-[1rem] hover:bg-blue-700 rounded-4xl cursor-pointer">
          Submit
        </button>
      </form>
    </>
  );
};

export default CreatingWorkspace;
