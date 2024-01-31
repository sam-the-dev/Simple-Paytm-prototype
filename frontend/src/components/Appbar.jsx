import { useEffect } from "react";
import { currentUserAtom } from "../atoms";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Appbar() {
  const setCurrentUser = useSetRecoilState(currentUserAtom);
  const currentUser = useRecoilValueLoadable(currentUserAtom);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCurrentUserInfo() {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/user/me",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (!data.username) return null;

        setCurrentUser(data);
      } catch (err) {
        console.log(err.message);
        return null;
      }
    }

    fetchCurrentUserInfo();
  }, []);

  const navigateToUpdatePage = () => {
    navigate("/update");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <>
      <nav className="w-full h-20 bg-white flex justify-between items-center px-7 border-[1.5px] border-solid border-gray-300">
        <h1 className="tracking-wide font-bold text-3xl">Payments App</h1>
        <button
          onClick={navigateToUpdatePage}
          className="rounded-md bg-black h-10 w-36 tracking-wider font-medium text-md text-white"
        >
          Update Info
        </button>
        <button
          onClick={logout}
          className="rounded-md bg-black h-10 w-36 tracking-wider font-medium text-md text-white"
        >
          Logout
        </button>
        <h1 className="tracking-wide text-lg font-medium">
          Hello,{" "}
          {currentUser.state === "hasValue" && currentUser.contents !== null
            ? currentUser.contents.firstName
            : ""}
        </h1>
      </nav>
    </>
  );
}
