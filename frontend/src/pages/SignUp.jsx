import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function SignUp() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  async function handleButtonClick() {
    if (
      !passwordRef.current.value ||
      !firstNameRef.current.value ||
      !lastNameRef.current.value ||
      !emailRef.current.value
    )
      return;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        {
          firstName: firstNameRef.current.value,
          lastName: lastNameRef.current.value,
          username: emailRef.current.value,
          password: passwordRef.current.value,
        }
      );

      if (!data.message === "User created successfully") return;

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      if (!err.response) {
        console.log(err.message);
        return;
      }

      console.log(err.response.data);
      return;
    }
  }

  function navigatetoSignIn() {
    navigate("/signin");
  }

  return (
    <>
      <div className="rounded-xl w-96 p-6 flex flex-col bg-white items-center justify-center gap-3 shadow-md">
        <h1 className="tracking-wide text-5xl font-bold">Sign Up</h1>
        <p className="tracking-wide text-center text-zinc-500 font-medium">
          Enter your information to create an account
        </p>

        <div className="flex flex-col gap-3 w-full mt-3 ">
          <div id="first-name" className="flex flex-col gap-1">
            <label htmlFor="firstName" className="tracking-wide font-bold ">
              First Name
            </label>
            <input
              type="text"
              placeholder="John"
              required
              className="h-8 p-5 tracking-wide border-[1.5px] border-solid border-gray-300 rounded-md"
              ref={firstNameRef}
            />
          </div>

          <div id="last-name" className="flex flex-col gap-1">
            <label htmlFor="lastName" className="tracking-wide font-bold ">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              className="h-8 p-5 tracking-wide border-[1.5px] border-solid border-gray-300 rounded-md"
              ref={lastNameRef}
              required
            />
          </div>

          <div id="email" className="flex flex-col gap-1">
            <label htmlFor="email" className="tracking-wide font-bold ">
              Email
            </label>
            <input
              type="text"
              placeholder="johndoe@example.com"
              className="h-8 p-5 tracking-wide border-[1.5px] border-solid border-gray-300 rounded-md"
              ref={emailRef}
              required
            />
          </div>

          <div id="password" className="flex flex-col gap-1">
            <label htmlFor="password" className="tracking-wide font-bold ">
              Password
            </label>
            <input
              type="text"
              placeholder="Enter a Strong Password"
              className="h-8 p-5 tracking-wide border-[1.5px] border-solid border-gray-300 rounded-md"
              ref={passwordRef}
              required
            />
          </div>
        </div>

        <button
          className="w-full bg-zinc-900 tracking-wide text-md text-white rounded-md h-12 mt-4"
          onClick={handleButtonClick}
        >
          Sign Up
        </button>
        <p className="tracking-wide">
          Already have an account?{" "}
          <button onClick={navigatetoSignIn} className="underline">
            Login
          </button>
        </p>
      </div>
    </>
  );
}
