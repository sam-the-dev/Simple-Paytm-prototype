import { useRecoilValueLoadable, useRecoilValue } from "recoil";
import { currentUserAtom, filterAtom } from "../atoms";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function UserList() {
  const [users, setUsers] = useState([]);
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const filter = useRecoilValue(filterAtom);
  const navigate = useNavigate();

  //   const currentUser = useRecoilValueLoadable(currentUserAtom);

  //   if (currentUser.state !== "hasValue" && currentUser.contents === null) return;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [debouncedFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 500);

    return () => clearTimeout(timeout);
  }, [filter]);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/user/bulk?filter=` + debouncedFilter
      );

      setUsers(data.users);
    } catch (err) {
      console.log(err.message);
      return;
    }
  }

  const navigateToSendMoney = (user) => {
    console.log(user);

    navigate(
      `/send?id=${user._id}&firstName=${user.firstName}&lastName=${user.lastName}`
    );
  };

  if (Array.isArray(users) && users.length > 0) {
    return (
      <>
        {users.map((user) => {
          return (
            <div className="flex justify-between  items-center" key={user._id}>
              <h1 className="text-black tracking-wider text-xl font-bold">
                {user.firstName + " " + user.lastName}
              </h1>
              <button
                className="rounded-md bg-black h-10 w-36 tracking-wider font-medium text-lg text-white"
                onClick={() => navigateToSendMoney(user)}
              >
                Send Money
              </button>
            </div>
          );
        })}
      </>
    );
  } else return <div></div>;
}
