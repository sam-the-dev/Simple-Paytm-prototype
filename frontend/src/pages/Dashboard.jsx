import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { checkUserValid } from "../App";
import { currentUserAtom, filterAtom } from "../atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { Balance } from "../components/Balance";
import { Appbar } from "../components/Appbar";
import { UserList } from "../components/Userlist";

export function Dashboard() {
  const [balance, setBalance] = useState("0000");
  const [filter, setFilter] = useRecoilState(filterAtom);
  const currentUser = useRecoilValue(currentUserAtom);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBalance();
  }, []);

  async function fetchBalance() {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/account/balance`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setBalance(data.balance);
    } catch (err) {
      console.log(err.message);
      return;
    }
  }

  return (
    <>
      <div className="h-screen w-full flex flex-col bg-white gap-6 sticky">
        <Appbar />

        <main className="flex flex-col gap-8 px-4 h-screen ">
          <Balance balance={balance} />

          <div className="flex flex-col gap-2">
            <h1 className="text-black tracking-wide font-bold text-2xl ">
              Users
            </h1>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full h-14 tracking-wide p-4 border-[1.5px] border-solid border-gray-300 rounded-md"
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-3 ">
            <UserList />
          </div>
        </main>
      </div>
    </>
  );
}
