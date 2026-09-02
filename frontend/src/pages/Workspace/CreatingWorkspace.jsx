import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const CreatingWorkspace = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { organizationId } = useParams();

  const onSubmit = async (data) => {
    try {
      setSuccessMessage("");
      setErrorMessage("");

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

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage(result.message || "Workspace created successfully!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        setErrorMessage(result.message || "Failed to create workspace!");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-6 bg-slate-50">
      {successMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-blue-600 px-6 py-3 text-white shadow-lg animate-[toast-in-out_5s_ease-in-out_forwards]">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-red-600 px-6 py-3 text-white shadow-lg">
          {errorMessage}
        </div>
      )}

      <div className="w-full max-w-lg bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Create New Workspace</h1>
          <p className="text-xs text-slate-500">Add a workspace to organize tasks and project members</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Workspace Title *
            </label>
            <input
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="e.g. Frontend Development"
              {...register("title", { required: "Enter the title", minLength: 5, maxLength: 30 })}
              type="text"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 h-28 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              {...register("description")}
              placeholder="Briefly describe what this workspace is for..."
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-sm cursor-pointer">
            Create Workspace
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatingWorkspace;
