import { useCallback, useRef, useState } from "react";
import { checkInCustomerService } from "../../services/customer.service";
import { Customer } from "../../types/customer";
import bg from "../../assets/bg-full.png";
import { io } from "socket.io-client";
export default function HomePage() {
  const [qr, setQR] = useState("");
  const [user, setUser] = useState<Customer>();
  const [message, setMessage] = useState("");
  const socket = io("http://localhost:3000");

  const useDebounce = (func: any, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return useCallback(
      (...args: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          func(...args);
        }, delay);
      },
      [func, delay]
    );
  };
  const handleCheckIn = async (e: any) => {
    try {
      const value: string = e.target.value;
      setQR(value);
      // useDebounce(setQR(value), 300);
      // if (value.length < 6) {
      //   return;
      // }

      const response = await checkInCustomerService(value);
      console.log("QR code client is", value);
      console.log("message response >> ", response.message);
      console.log("data >>", response.data);
      if (response.message === "Khách hàng đã check-in") {
        setUser(response.data);
        setMessage("ĐÃ CHECK IN");
        setQR("");
        return;
      } else if (response.message !== "success") {
        setMessage(response.message);
        setQR("");
        return;
      } else {
        setMessage("success");
        setUser(response.data);
        setQR("");
        sendNotification();
      }
      //   console.log(response);
    } catch (error) {
      return {
        message: error,
        data: "",
      };
    }
  };

  console.log("user >>", user);

  const sendNotification = () => {
    socket.emit("send_message", "Hello from client");
  };
  return (
    <main
      style={{ backgroundImage: `url(${bg})` }}
      // style={{ backgroundColor: "Highlight" }}
      className={`w-screen h-screen bg-cover   bg-center bg-no-repeat flex items-center justify-center`}
    >
      <div className="flex flex-col px-4 text-3xl mx-1.5 text-center text-white">
        <h1>
          {(message === "ĐÃ CHECK IN" || message === "success") && user
            ? user?.name
            : ""}
        </h1>
        <h1 className="px-4 text-3xl mx-1.5 my-2 text-center text-white">
          {(message === "ĐÃ CHECK IN" || message === "success") && user
            ? user?.position
            : ""}
        </h1>
        <h1 className={`px-4 text-2xl mx-1.5 my-2 text-gray-400 font-bold`}>
          {message === "success"
            ? "CHECK-IN THÀNH CÔNG"
            : message.toUpperCase()}
        </h1>

        <input
          value={qr}
          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          placeholder="QRCODE"
          onChange={(e) => useDebounce(handleCheckIn(e), 300)}
          autoFocus
          // hidden
        />
      </div>
    </main>
  );
}
