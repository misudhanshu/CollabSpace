import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });

  let navigate = useNavigate();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePassword = () => setIsPasswordVisible((p) => !p);

  const Icon = isPasswordVisible === false ? FaEye : FaEyeSlash;

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        navigate("/");
      } else {
        setErrorMessage(result.message || "Registration failed!");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Get started with Collab<span className="text-blue-600">Space</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Connect, collaborate on projects, and build amazing things.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs text-center font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Username *</label>
            <input
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              autoComplete="username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 2,
                  message: "Username should contain at least 2 characters",
                },
              })}
              placeholder="Your username"
            />
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p className="text-red-500 text-xs mt-1 font-medium" key={type}>
                    {message}
                  </p>
                ))
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              Gender <AiOutlineQuestionCircle className="text-slate-400" />
            </label>
            <select
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              name="gender"
              id="gender"
              {...register("gender")}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all pr-10"
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 5,
                    message: "Password must contain at least 5 characters!",
                  },
                })}
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Create a password"
              />
              <Icon
                onClick={togglePassword}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 hover:text-blue-600 cursor-pointer text-base"
              />
            </div>

            <ErrorMessage
              errors={errors}
              name="password"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p className="text-red-500 text-xs mt-1 font-medium" key={type}>
                    {message}
                  </p>
                ))
              }
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-white font-semibold rounded-xl text-sm transition-all shadow-xs cursor-pointer">
            Create Account
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-100">
          <button
            onClick={() => {
              navigate("/");
            }}
            className="w-full py-3 text-slate-700 hover:text-blue-600 font-semibold border border-slate-200 hover:bg-blue-50 rounded-xl text-sm transition-all cursor-pointer"
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
