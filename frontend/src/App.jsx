import React, { useEffect } from "react";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
import { UpdatePage } from "./pages/UpdatePage";
import { Route, Routes, useNavigate } from "react-router-dom";
import { RecoilRoot } from "recoil";
import axios from "axios";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const userValid = checkUserValid();

    if (!userValid || !userValid.username) {
      navigate("/signin");
    } else {
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      <div className="h-screen w-full flex justify-center items-center bg-zinc-400">
        <RecoilRoot>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" element={<SendMoney />} />
            <Route path="/update" element={<UpdatePage />} />
          </Routes>
        </RecoilRoot>
      </div>
    </>
  );
}

export const checkUserValid = async function () {
  try {
    const { data } = await axios.get("http://localhost:3000/api/v1/user/me", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!data.username) return null;

    return data;
  } catch (err) {
    console.log(err.message);
    return null;
  }
};

export default App;
