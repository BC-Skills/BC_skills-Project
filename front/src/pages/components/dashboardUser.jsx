import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/contextProvider";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../axios";
import "../../assets/css/dashboard.css";
import logo from "../../assets/images/logo.png";
import Chat from "./Chat/chat";
import { io } from "socket.io-client";
import NotificationAlert from 'react-notification-alert';



export default function DashboardUser() {
    // eslint-disable-next-line no-unused-vars
    const [privilegeSettings, setPrivilegeSettings] = useState({});
    const [links, setLinks] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    const { userToken, profile, unreadMessageCount , handleUnreadMessageCountChange} = useStateContext();
    const [blackDivVisible, setBlackDivVisible] = useState(false);
    const { currentUser } = useStateContext();

    // eslint-disable-next-line no-unused-vars
    const [activeLinkIndex, setActiveLinkIndex] = useState(-1);
    const [isSidebarActive, setIsSidebarActive] = useState(false);

  
    useEffect(() => {
    
        const socket = io("http://localhost:3001", { transports: ["websocket"] });
    
        socket.on("unreadMessageCount", (count) => {
            console.log("Received unreadMessageCount event");
            handleUnreadMessageCountChange(count);
        });
    
        if (currentUser) {
            console.log("Emitting getUnreadMessageCount event");
            socket.emit("getUnreadMessageCount", currentUser.id);
        }
    
        return () => {
            console.log("Effect cleanup");
            socket.disconnect();
        };
    }, [currentUser]);



      
    const handleToggleClick = () => {
        setIsSidebarActive(!isSidebarActive);
    };

    const navigate = useNavigate(); // Get the navigate function from useNavigate hook

    if (!userToken || profile.name === "admin") {
        return <Navigate to="/" />;
    }

    

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const storedLinks = localStorage.getItem("links");
        if (storedLinks) {
            setLinks(JSON.parse(storedLinks));
            setLoading(false);
        } else {
            setLoading(true);
            getPrivilages();
        }
    }, []);


 

    const getPrivilages = async () => {
        try {
            const response = await axiosClient.get(
                `profiless/${profile.id}/privileges`
            );

            const privilegeStatusMap = {}; // To store privilege names for each status

            const privilegeIds = response.data.map(
                (privilege) => privilege.status_id
            );
            const promises = privilegeIds.map((id) =>
                axiosClient.get(`statuses/${id}`)
            );
            const responses = await Promise.all(promises);

            // Build the privilegeStatusMap object
            responses.forEach((statusResponse, index) => {
                const statusName = statusResponse.data.name;
                const privilegeName = response.data[index].name;

                if (!privilegeStatusMap[statusName]) {
                    privilegeStatusMap[statusName] = [];
                }

                privilegeStatusMap[statusName].push(privilegeName);
            });

            const statusNames = responses.map((response) => response.data.name);
            const uniqueStatusNames = Array.from(new Set(statusNames));

            const linksArray = uniqueStatusNames
                .map((statusName) => {
                   

                    const url =
                        "/users/" +
                        statusName.toLowerCase().replace(/\s/g, "-");
                    const logo = statusName.toLowerCase(); // Assuming the logo name follows this pattern
                    let attribute = "";

                    // Compare the status name with the static const variables
                    if (statusName === "projets") {
                        attribute = "code-outline";
                    } else if (statusName === "formation") {
                        attribute = "newspaper-outline";
                    } else if (statusName === "schedules") {
                        attribute = "calendar-outline";
                    } else if (statusName === "tickets") {
                        attribute = "ticket-outline";
                    } else if (statusName === "users") {
                        attribute = "people-outline";
                    }

                    const matchingResponse = responses.find(
                        (response) => response.data.name === statusName
                    );
                    const id = matchingResponse
                        ? matchingResponse.data.id
                        : null;

                    return {
                        name: statusName,
                        url,
                        logo,
                        attribute,
                        id,
                        privilegeNames: privilegeStatusMap[statusName] || [],
                    };
                })
                .filter(Boolean);

            setLinks(linksArray);
            setPrivilegeSettings(response.data[0].status_id);
            setLoading(false);
            localStorage.setItem("links", JSON.stringify(linksArray));
        } catch (error) {
            if (error.response && error.response.status === 429) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
                getPrivilages();
            } else {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        }
    };

    const logout = async () => {
        try {
            const response = await axiosClient.post('logout', currentUser );
    

            if (response.status === 200) {
                sessionStorage.clear();
                localStorage.clear();
                navigate("/");
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
    
    // Function to toggle the visibility of the black div
    const toggleBlackDiv = () => {
        setBlackDivVisible(!blackDivVisible);
    };

  
 


    
    return (
        <div className="container">
            <div className={`navigation  ${isSidebarActive ? "active" : ""}`}>
                <ul className="mt-[10%]">
                    <li className="flex justify-center items-center">
                        <span className="icon">
                            <img
                                src={logo}
                                className="w-full h-full object-contain animate-pulse"
                                alt="Logo"
                            />
                        </span>
                    </li>
                    {links
                        .filter((link) => link.name.toLowerCase() !== "sprints")
                        .map((link) => (
                            <li key={link.id}>
                                <a href={link.url}>
                                    <span className="icon">
                                        <ion-icon
                                            name={link.attribute}
                                        ></ion-icon>
                                    </span>
                                    <span className="title">{link.name}</span>
                                </a>
                            </li>
                        ))}
                </ul>
                <ul className="pt-8">
                    <li></li>
                    <li>
                        <Link to="/users">
                            <span className="icon">
                                <ion-icon name="people-outline"></ion-icon>
                            </span>
                            <span className="title">Profil</span>
                        </Link>
                    </li>
                    <li>
                        <a  onClick={logout}>
                            <span className="icon">
                                <ion-icon name="log-out-outline"></ion-icon>
                            </span>
                            <span className="title">Log Out</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div
                className={`main flex flex-col flex-1   ${
                    isSidebarActive ? "active" : ""
                }`}
            >     
                <div className="topbar mt-4 ">
                    <div className="toggle" onClick={handleToggleClick}>
                        <ion-icon name="menu-outline"></ion-icon>
                    </div>
                    <div className="flex flex-row gap-6 justify-center items-center"></div>
                </div>
                <div className="flex-1 p-2 flex  gap-10 flex-row justify-between flex-wrap">
                    <Outlet  />
                </div>
            </div>
            <div
                className="fixed bottom-14 right-14 z-10 bg-purple-50 text-white p-2 rounded-full flex items-center justify-center cursor-pointer"
                onClick={toggleBlackDiv}
            >
                      <span className="relative inline-block ">
                    <svg className="w-20 h-20 text-gray-700 fill-current" viewBox="0 0 20 20"><path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-lg font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{unreadMessageCount}</span>
                    </span>

            </div>
            {blackDivVisible && (
                <div className="fixed bottom-25 right-1 flex z-20 h-[90vh]    text-white px-2 py-2 rounded">
                        <Chat />
                </div>
            )}
             

        </div>
    );
}
