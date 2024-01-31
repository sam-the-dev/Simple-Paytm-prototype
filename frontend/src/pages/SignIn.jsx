import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function SignIn() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleButtonClick() {
    if (!emailRef.current.value || !passwordRef.current.value) return;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        {
          username: emailRef.current.value,
          password: passwordRef.current.value,
        }
      );

      console.log(data.message);

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

  function navigatetoSignUp() {
    navigate("/signup");
  }

  return (
    <>
      <div className="rounded-xl w-96 p-6 flex flex-col bg-white items-center justify-center gap-3 shadow-md">
        <h1 className="tracking-wide text-4xl font-bold">Sign In</h1>
        <p className="tracking-wide text-center text-zinc-500 font-medium">
          Enter your credentials to access your account
        </p>

        <div className="flex flex-col gap-3 w-full mt-3 ">
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
          Sign In
        </button>
        <p className="tracking-wide">
          Dont't have an account?{" "}
          <button onClick={navigatetoSignUp} className="underline">
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
}
