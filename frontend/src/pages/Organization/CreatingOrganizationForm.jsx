import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../../index.css";

const CreatingOrganizationForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {

    const response = await fetch("http://localhost:8000/organization/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: data.organizationName,
      }),
    });
    if (response.ok) {
      const result = await response.json();
      setSuccessMessage("Organization created successfully!");
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
      <h1 className="text-xl font-bold flex justify-center my-[5%]">
        Organization Form
      </h1>
      <form
        className="h-[40vh] w-[50%] border rounded-lg mx-[25%] my-[10%] p-[2%]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mx-[2%]">Name:</label>
        <input
          className="mt-[2%] p-[2%] w-[70%] border"
          {...register("organizationName", { required: "Enter the name" })}
          type="text"
        />
        <button className="border text-base mt-[35%] mx-[10%] w-[80%] rounded-lg md:rounded-2xl p-[5%] bg-blue-500 text-white sm:mt-[30%] md:mt-[20%] lg:mt-[13%] xl:mt-[6%] sm:w-[90%] md:w-[91%] xl:w-[95%] bg-blue-600 py-3 text-white mx-[4.5%] sm:mx-[2.5%] md:mx-[2%] lg:mx-[1%] p-[0.5rem] xl:py-[1rem] hover:bg-blue-700 rounded-4xl cursor-pointer">
          Submit
        </button>
      </form>
    </>
  );
};

export default CreatingOrganizationForm;
