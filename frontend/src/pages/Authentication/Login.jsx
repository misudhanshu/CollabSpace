import React, { useState } from "react";
import CollabSpace from "../../assets/CollabSpace.png";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePassword = () => setIsPasswordVisible((p) => !p);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });

  let navigate = useNavigate();

  const Icon = isPasswordVisible === false ? FaEye : FaEyeSlash;

  const onSubmit = async (data) => {
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success === true) navigate("/home");

  };

  return (
    <div className="flex flex-col mt-[30%] sm:mt-[10%] md:mt-[5%] sm:ml-[5%] gap-[1rem]">
      <div className="flex justify-center mb-0">
        <img className="w-[8rem] h-[7rem]" src={CollabSpace} />
      </div>
      <h1 className="font-bold text-base md:text-lg lg:text-2xl gap-3 flex justify-center">
        Collab <span className="text-[#14b3b2]">Space</span>
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Enter username"
          className="w-[90%] p-[1rem] font-serif border border-gray-400 active:border-black mx-[1rem] mt-[15%] lg:mt-[10%] xl:py-[1rem] rounded-md placeholder:font-semibold"
          autoComplete="username"
          {...register("username", {
            required: "Username is required!",
            minLength: {
              value: 5,
              message: "Username must contain at least 5 characters!",
            },
            maxLength: {
              value: 15,
              message: "Username can contain maximum 15 characters!",
            },
          })}
        />
        <ErrorMessage
          errors={errors}
          name="username"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <p className="text-red-500 mx-[5%] md:mx-[2%]" key={type}>
                {message}
              </p>
            ))
          }
        />

        <div className="mb-[5%]">
          <div className="flex justify-between relative">
            <input
              className="w-[90%] p-[1rem] font-serif border border-gray-400 active:border-black mx-[1rem] mt-[5%] lg:mt-[2%] rounded-md placeholder:font-semibold"
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
              className="absolute top-[55%] md:top-[62%] lg:top-[50%] xl:top-[55%] right-[10%] md:right-[12%] lg:text-xl cursor-pointer"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <p
                  className="text-red-500 mx-[5%] md:mx-[2%] mb-[3%]"
                  key={type}
                >
                  {message}
                </p>
              ))
            }
          />
        </div>

        <button
          className="w-[91%] bg-blue-600 py-3 text-white mx-[4.5%] sm:mx-[2.5%] md:mx-[2%] lg:mx-[1%] p-[0.5rem] xl:py-[1rem] hover:bg-blue-700 rounded-4xl cursor-pointer"
        >
          Log In
        </button>
        <button
          className="w-[91%] mt-[5rem] lg:mt-[2rem] mb-[4rem] font-semibold py-3 text-blue-500 border border-blue-500 mx-[4.5%] sm:mx-[2.5%] md:mx-[2%] lg:mx-[1%] p-[0.5rem] xl:py-[1rem] hover:bg-gray-100 rounded-4xl cursor-pointer"
          onClick={() => {
            navigate("/register");
          }}
        >
          Create new account
        </button>
      </form>
    </div>
  );
};

export default Login;
