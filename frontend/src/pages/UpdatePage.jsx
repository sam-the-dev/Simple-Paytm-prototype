import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";

export function UpdatePage() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  async function updateInfo() {
    if (
      !passwordRef.current.value &&
      !firstNameRef.current.value &&
      !lastNameRef.current.value
    )
      return;

    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const password = passwordRef.current.value;

    const requestBody = {};
    if (firstName) requestBody.firstName = firstName;
    if (lastName) requestBody.lastName = lastName;
    if (password) requestBody.password = password;

    try {
      const res = await axios.put(
        `http://localhost:3000/api/v1/user/update`,
        requestBody,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      console.log(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      // if (err.response) {
      //   console.log(err.response.message);
      //   return;
      // }

      console.log(err.message);
      return;
    }
  }

  return (
    <>
      <div className="rounded-xl w-96 p-6 flex flex-col bg-white items-center justify-center gap-3 shadow-md">
        <h1 className="tracking-wide text-5xl font-bold">Update Info</h1>
        <p className="tracking-wide text-center text-zinc-500 font-medium">
          Enter your new credentials
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
          onClick={updateInfo}
        >
          Update
        </button>
      </div>
    </>
  );
}
