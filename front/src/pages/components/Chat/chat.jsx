/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import axiosClient from "../../../axios";
import { useStateContext } from "../../../contexts/contextProvider";
import io from "socket.io-client";

const socket = io("http://localhost:3001", { transports: ["websocket"] });

function Chat() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Add selectedUser state
    //   const [loading, setLoading] = useState(true);
    const { currentUser } = useStateContext();
    const [chatid, setchatid] = useState(null);

    useEffect(() => {
        fetchUsersData();
    }, []);

    const fetchUsersData = async () => {
        try {
            const response = await axiosClient.get(
                `userss/except/${currentUser.id}`
            );
            const usersData = response.data;
            setUsers(usersData);
            //   setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            //   setLoading(false);
        }
    };

    const handleUserClick = async (user) => {
        try {
            const requestData = {
                user_id: currentUser.id,
                other_user_id: user.id,
            };
            const response = await axiosClient.post(
                "/chats/getOrCreateChat",
                requestData
            );
            const conversationData = response.data;
            setchatid(conversationData.id); // Make sure this doesn't affect the display
            setSelectedUser(user);
        } catch (error) {
            console.error("Error fetching conversation:", error);
        }
    };

    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [socketConnected, setSocketConnected] = useState(false); // New state for socket connection status
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = io("http://localhost:3001", {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            setSocketConnected(true); // Socket is connected
        });

        // Fetch previous messages when the component mounts
        fetch(`http://localhost:3001/api/messages/${chatid}`)
            .then((response) => response.json())
            .then((data) => {
                setMessages(data);
                setLoading(false); // Once messages are loaded, set loading to false
            })
            .catch((error) => {
                console.error("Error fetching messages:", error);
                setLoading(false); // If an error occurs, set loading to false
            });

        socket.on("chat message", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            console.log(newMessage);
        });

        return () => {
            socket.disconnect();
        };
    }, [chatid]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() !== "" && socketConnected) {
            const newMessage = {
                chat_id: chatid,
                from: currentUser.id,
                content: inputValue,
            };
            socket.emit("chat message", newMessage);
            setInputValue("");
        }
    };

    return (
        <div className="container m-auto shadow-2xl bg-blue-300 text-white">
            <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
                <div className="border-r border-gray-300 lg:col-span-1 ">
                    <div className="mx-3 my-3">
                        <div className="relative text-black">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6 text-purple-400"
                                >
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </span>
                            <input
                                type="search"
                                className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
                                name="search"
                                placeholder="Search"
                                required
                            />
                        </div>
                    </div>

                    <ul className="overflow-auto h-[32rem] ">
                        <h2 className="my-2 mb-2 ml-2  text-lg text-white">
                            Chats
                        </h2>
                        {users.map((user) => (
                            <li key={user.id}>
                                <a
                                    className="flex items-center px-3 py-2 bg-white mt-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-200 focus:outline-none"
                                    onClick={() => handleUserClick(user)}
                                >
                                    <img
                                        className="object-cover w-10 h-10 rounded-full"
                                        src={user.profile_picture}
                                        alt={user.name}
                                    />
                                    <div className="w-full pb-2">
                                        <div className="flex justify-between">
                                            <span className="block ml-2 font-semibold text-black">
                                                {user.name}
                                            </span>
                                            <span className="block ml-2 text-sm text-black">
                                                {user.connected
                                                    ? "Connected"
                                                    : "Not Connected"}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hidden lg:col-span-2 lg:block ">
                    <div className="w-full">
                        {selectedUser ? (
                            <div>
                                <div className="relative flex items-center p-3 border-b border-gray-300 bg-blue-300">
                                    <img
                                        className="object-cover w-10 h-10 rounded-full"
                                        src={selectedUser.profile_picture}
                                        alt={selectedUser.name}
                                    />
                                    <span className="block ml-2 font-bold text-white">
                                        {selectedUser.name}
                                    </span>
                                    <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
                                </div>
                                <div className="relative w-full p-6 overflow-y-auto h-[40rem] bg-white">
                                    {loading ? (
                                        <p>Loading messages...</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {messages.map((message, index) => (
                                                <li
                                                    key={index}
                                                    className={`flex max-w-[600px]  justify-start ${
                                                        message.from ===
                                                        currentUser.id
                                                            ? "justify-end"
                                                            : ""
                                                    }`}
                                                >
                                                    <div
                                                        className={`relative flex max-w-[600px] items-center px-4 py-2 text-black rounded shadow-2xl ${
                                                            message.from ===
                                                            currentUser.id
                                                                ? "bg-purple-300 justify-end"
                                                                : "bg-blue-300"
                                                        } whitespace-normal overflow-wrap break-word`} // Add overflow-wrap and break-word for added control
                                                    >
                                                        {message.content}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <form
                                    className="flex items-center justify-between w-full p-3 border-t border-gray-300 text-black bg-white"
                                    onSubmit={handleFormSubmit}
                                >
                                    <input
                                        type="text"
                                        placeholder="Message"
                                        className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700 shadow-2xl"
                                        name="message"
                                        required
                                        value={inputValue}
                                        onChange={handleInputChange}
                                    />

                                    <button
                                        type="submit"
                                        className="flex items-center bg-blue-300 rounded-full justify-center gap-3 p-2"
                                    >
                                        <svg
                                            width="40px"
                                            height="40px"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M19.2111 2.06722L3.70001 5.94499C1.63843 6.46039 1.38108 9.28612 3.31563 10.1655L8.09467 12.3378C9.07447 12.7831 10.1351 12.944 11.1658 12.8342C11.056 13.8649 11.2168 14.9255 11.6622 15.9053L13.8345 20.6843C14.7139 22.6189 17.5396 22.3615 18.055 20.3L21.9327 4.78886C22.3437 3.14517 20.8548 1.6563 19.2111 2.06722ZM8.92228 10.517C9.85936 10.943 10.9082 10.9755 11.8474 10.6424C12.2024 10.5165 12.5417 10.3383 12.8534 10.1094C12.8968 10.0775 12.9397 10.0446 12.982 10.0108L15.2708 8.17974C15.6351 7.88831 16.1117 8.36491 15.8202 8.7292L13.9892 11.018C13.9553 11.0603 13.9225 11.1032 13.8906 11.1466C13.6617 11.4583 13.4835 11.7976 13.3576 12.1526C13.0244 13.0918 13.057 14.1406 13.4829 15.0777L15.6552 19.8567C15.751 20.0673 16.0586 20.0393 16.1147 19.8149L19.9925 4.30379C20.0372 4.12485 19.8751 3.96277 19.6962 4.00751L4.18509 7.88528C3.96065 7.94138 3.93264 8.249 4.14324 8.34473L8.92228 10.517Z"
                                                fill="#0F1729"
                                            />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div>Select a user to start chatting</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
