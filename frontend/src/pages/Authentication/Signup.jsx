import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useNavigate } from "react-router-dom";

const Signup = () => {
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
    const response = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    navigate("/");
  };

  return (
    <div className="mx-[5%] sm:mx-[25%] lg:mx-[35%]">
      <h1 className="text-lg font-semibold lg:text-2xl mt-[5%] p-[1%]">
        Get started with Collab Space
      </h1>
      <p className="text-xs/5 lg:text-base font-serif font-times p-1">
        A space to connect with developers, collaborate on projects, share
        ideas, learn together, and build amazing things.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="my-[1rem]">
        <label className="font-semibold block">Name</label>
        <div className="flex w-[100%] mt-[1%] gap-[5%]">
          <input
            className="border border-gray-300 focus:border-black rounded-lg w-[65%] placeholder:font-serif p-[2.5%]"
            autoComplete="username"
            {...register("username", {
              required: "Uirstname is required",
              minLength: {
                value: 2,
                message: "Username should contain atleast 2 characters",
              },
            })}
            placeholder="User name"
          />
          <ErrorMessage
            errors={errors}
            name="multipleErrorInput"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <p className="text-red-500" key={type}>
                  {message}
                </p>
              ))
            }
          />
        </div>
        <label className="font-semibold flex gap-1 mt-[5%]">
          Gender <AiOutlineQuestionCircle className="mt-1" />
        </label>
        <select
          className="w-[95%] px-4 py-[1%] rounded-lg h-[2rem] lg:h-[3rem] mt-[2%] border border-gray-500 focus:border-black"
          name="gender"
          id="gender"
          {...register("gender")}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label className="font-semibold flex gap-1 mt-[5%]">Password</label>
        <div className="relative">
          <input
            className="w-[95%] rounded-lg border border-gray-300 focus:border-black mt-[1%] p-[3%]"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required!",
              minLength: {
                value: 5,
                message: "Password must contain at least 5 characters!",
              },
            })}
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Enter password"
          />
          <Icon
            onClick={togglePassword}
            className="absolute top-[40%] right-[10%] lg:text-xl cursor-pointer"
          />
        </div>

        <ErrorMessage
          errors={errors}
          name="password"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <p className="text-red-500 mx-[5%] md:mx-[2%] mb-[3%]" key={type}>
                {message}
              </p>
            ))
          }
        />
        <button className="w-[91%] bg-blue-600 py-3 text-white mt-[10%] mx-[4.5%] sm:mx-[2.5%] md:mx-[2%] lg:mx-[1%] p-[0.5rem] xl:py-[1rem] hover:bg-blue-700 rounded-4xl cursor-pointer">
          Submit
        </button>
      </form>
      <button
        onClick={() => {
          navigate("/");
        }}
        className="w-[91%] bg-gray-200 py-3 mt-[5%] mx-[4.5%] sm:mx-[2.5%] md:mx-[2%] lg:mx-[1%] p-[0.5rem] xl:py-[1rem] mb-5 hover:bg-gray-300 rounded-4xl cursor-pointer"
      >
        I already have a account
      </button>
    </div>
  );
};

export default Signup;
