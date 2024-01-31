import { useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export function SendMoney() {
  const [searchParams, setSearchParams] = useSearchParams();
  const amount = useRef();
  const navigate = useNavigate();

  const fullName =
    searchParams.get("firstName") + " " + searchParams.get("lastName");
  const userId = searchParams.get("id");

  async function sendMoneyToFriend() {
    if (!amount.current.value) return;
    if (parseInt(amount.current.value) <= 0) return;

    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/v1/account/transfer`,
        { amount: amount.current.value, to: userId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      console.log(data.message);
      navigate("/dashboard");
    } catch (err) {
      console.log(err.message);
      return;
    }
  }

  return (
    <>
      <div className="shadow-md w-[27rem] bg-white flex flex-col p-8 gap-3 items-center rounded-lg">
        <h1 className="font-bold text-4xl mb-12">Send Money</h1>

        <div className="flex items-center gap-3 min-w-full">
          <div className="rounded-full bg-green-500 flex justify-center items-center h-12 w-12 font-medium text-2xl text-white">
            {fullName[0].toUpperCase()}
          </div>
          <h1 className="tracking-wide font-bold text-2xl">{fullName}</h1>
        </div>

        <p className="tracking-wide w-full font-bold">Amount (in Rs)</p>
        <input
          type="number"
          placeholder="Enter Amount"
          className="border-[1.5px] border-solid border-gray-300 w-full h-11 p-4 rounded-md"
          ref={amount}
          required
        />
        <button
          onClick={sendMoneyToFriend}
          className="w-full h-11 tracking-wide text-white bg-green-500 text-lg rounded-md"
        >
          Initiate Transfer
        </button>
      </div>
    </>
  );
}
