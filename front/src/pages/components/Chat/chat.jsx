/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../axios";
import { useStateContext } from "../../../contexts/contextProvider";
import io from "socket.io-client";

const socket = io("http://localhost:3001", { transports: ["websocket"] });

const isURL = (text) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(text);
  };

  
function Chat() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Add selectedUser state
    //   const [loading, setLoading] = useState(true);
    const { currentUser, handleUnreadMessageCountChange } = useStateContext();
    const [chatid, setchatid] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [socketConnected, setSocketConnected] = useState(false); // New state for socket connection status
    const [messages, setMessages] = useState([]);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        socket.emit("getUsers", currentUser.id);

        socket.on("users", (usersData) => {
            setUsers(usersData);
            console.log(usersData);
        });

        return () => {
            socket.off("users"); // Clean up the event listener
        };
    }, []);

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
            socket.emit("updateAllNotifyStatus", conversationData.id);
            socket.emit("getUnreadMessageCount", currentUser.id);
            socket.on("unreadMessageCount", (count) => {
                handleUnreadMessageCountChange(count);
            });
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
            }
        } catch (error) {
            console.error("Error fetching conversation:", error);
        }

        if (
            chatid !== null &&
            user.last_message.type === "received" &&
            user.last_message.notify === 0
        ) {
            const updatedUser = { ...user };
            updatedUser.last_message.notify = true;
            setUsers((prevList) =>
                prevList.map((prevUser) =>
                    prevUser.id === updatedUser.id ? updatedUser : prevUser
                )
            );
        }
    };

    useEffect(() => {
        const socket = io("http://localhost:3001", {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            setSocketConnected(true); // Socket is connected
        });

        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/api/messages/${chatid}`
                );
                const data = await response.json();
                setMessages(data);
                setLoading(false); // Once messages are loaded, set loading to false
            } catch (error) {
                console.error("Error fetching messages:", error);
                setLoading(false); // If an error occurs, set loading to false
            }
        };

        fetchMessages();
        socket.on("chat message", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit("getUsers", currentUser.id);
            socket.on("users", (usersData) => {
                setUsers(usersData);
            });
            socket.emit("getUnreadMessageCount", currentUser.id);
            socket.on("unreadMessageCount", (count) => {
                handleUnreadMessageCountChange(count);
            });
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
                to: selectedUser.id,
                datemessage: new Date().toISOString(),
                notify: false,
                vu: false,
            };
            socket.emit("chat message", newMessage);
            socket.emit("getUnreadMessageCount", currentUser.id);
            socket.on("unreadMessageCount", (count) => {
                handleUnreadMessageCountChange(count);
            });
            setInputValue("");
        }
        socket.emit("getUsers", currentUser.id);
        socket.on("users", (usersData) => {
            setUsers(usersData);
        });
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container m-auto shadow-2xl bg-blue-200 text-white">
            <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
                <div className="border-r border-gray-300 lg:col-span-1 overflow-auto h-[47rem]">
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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <ul className="mb-4">
                        <h2 className="my-2 mb-2 ml-2 text-2xl text-black font-bold">
                            Chats
                        </h2>
                        {filteredUsers.map((user) => (
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
                                    <div className="w-full pb-2 max-w-[250px]">
                                        <div className="flex justify-between">
                                            <span className="block ml-2 font-semibold text-black">
                                                {user.name}
                                            </span>
                                            <div className="flex items-center ml-2">
                                                <div
                                                    className={`w-3 h-3 rounded-full mr-1 ${
                                                        user.is_connected
                                                            ? "bg-green-500"
                                                            : "bg-gray-400"
                                                    }`}
                                                ></div>
                                                <span className="text-sm text-black">
                                                    {user.is_connected
                                                        ? "Connected"
                                                        : "Not Connected"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 justify-between items-center flex">
                                            <span className="block ml-2 text-black overflow-hidden">
                                                {user.last_message &&
                                                user.last_message.type ===
                                                    "received" ? (
                                                    <span
                                                        className="max-w-[150px]"
                                                        style={{
                                                            color: "blue",
                                                            whiteSpace:
                                                                "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                        }}
                                                    >
                                                        {
                                                            user.last_message
                                                                .content
                                                        }
                                                    </span>
                                                ) : user.last_message &&
                                                  user.last_message.type ===
                                                      "sent" ? (
                                                    <span
                                                        className="max-w-[100px]"
                                                        style={{
                                                            color: "green",
                                                            whiteSpace:
                                                                "nowrap", // Prevent line break
                                                            overflow: "hidden", // Hide overflow
                                                            textOverflow:
                                                                "ellipsis", // Show ellipsis for overflow
                                                        }}
                                                    >
                                                        {
                                                            user.last_message
                                                                .content
                                                        }
                                                    </span>
                                                ) : (
                                                    <span>No messages</span>
                                                )}
                                            </span>
                                            <span className="block ml-2 text-black">
                                                {user.last_message &&
                                                    user.last_message.type ===
                                                        "received" &&
                                                    user.last_message.notify ===
                                                        0 && (
                                                        <span
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            New Message
                                                        </span>
                                                    )}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hidden   lg:col-span-2 lg:block ">
                    <div className="w-full h-full flex ">
                        {selectedUser ? (
                            <div className=" flex-1 ">
                                <div
                                    ref={chatContainerRef}
                                    className="relative flex items-center p-3 border-b border-gray-300 bg-blue-300"
                                >
                                    <img
                                        className="object-cover w-10 h-10 rounded-full"
                                        src={selectedUser.profile_picture}
                                        alt={selectedUser.name}
                                    />
                                    <span className="block ml-2 font-bold text-black text-xl">
                                        {selectedUser.name}
                                    </span>
                                    <span
                                        className={`absolute w-3 h-3 rounded-full left-10 top-3 ${
                                            selectedUser &&
                                            selectedUser.is_connected
                                                ? "bg-green-600"
                                                : "bg-gray-300"
                                        }`}
                                    ></span>{" "}
                                </div>
                                <div
                                    className="relative w-full p-6 overflow-y-auto h-[40rem] bg-white flex flex-col-reverse"
                                    ref={chatContainerRef}
                                >
                                    {loading ? (
                                        <p>Loading messages...</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {messages.map((message, index) => (
                                                <li
                                                    key={index}
                                                    className={`flex max-w-[600px] items-center justify-start ${
                                                        message.from ===
                                                        currentUser.id
                                                            ? "justify-end"
                                                            : ""
                                                    }`}
                                                >
                                                    <div
                                                        className={`relative flex max-w-[600px] items-center px-4 py-2 text-lg text-black rounded shadow-2xl ${
                                                            message.from ===
                                                            currentUser.id
                                                                ? "bg-purple-300 justify-end"
                                                                : "bg-blue-300"
                                                        } whitespace-normal overflow-wrap break-word`}
                                                    >
                                                        {isURL(
                                                            message.content
                                                        ) ? (
                                                            <>
                                                            link : 
                                                            <a
                                                                href={
                                                                    message.content
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={
                                                                    message.from ===
                                                                    currentUser.id
                                                                        ? "text-black underline"
                                                                        : "text-blue-700 underline"
                                                                }
                                                            >
                                                                {
                                                                    message.content
                                                                }
                                                            </a>
                                                            </>
                                                        ) : (
                                                            message.content
                                                        )}
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
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M19.2111 2.06722L3.70001 5.94499C1.63843 6.46039 1.38108 9.28612 3.31563 10.1655L8.09467 12.3378C9.07447 12.7831 10.1351 12.944 11.1658 12.8342C11.056 13.8649 11.2168 14.9255 11.6622 15.9053L13.8345 20.6843C14.7139 22.6189 17.5396 22.3615 18.055 20.3L21.9327 4.78886C22.3437 3.14517 20.8548 1.6563 19.2111 2.06722ZM8.92228 10.517C9.85936 10.943 10.9082 10.9755 11.8474 10.6424C12.2024 10.5165 12.5417 10.3383 12.8534 10.1094C12.8968 10.0775 12.9397 10.0446 12.982 10.0108L15.2708 8.17974C15.6351 7.88831 16.1117 8.36491 15.8202 8.7292L13.9892 11.018C13.9553 11.0603 13.9225 11.1032 13.8906 11.1466C13.6617 11.4583 13.4835 11.7976 13.3576 12.1526C13.0244 13.0918 13.057 14.1406 13.4829 15.0777L15.6552 19.8567C15.751 20.0673 16.0586 20.0393 16.1147 19.8149L19.9925 4.30379C20.0372 4.12485 19.8751 3.96277 19.6962 4.00751L4.18509 7.88528C3.96065 7.94138 3.93264 8.249 4.14324 8.34473L8.92228 10.517Z"
                                                fill="#0F1729"
                                            />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex-1 bg-white text-black flex items-center text-3xl justify-center">
                                Select a user to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
