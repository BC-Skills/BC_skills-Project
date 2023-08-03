/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useStateContext } from "../../contexts/contextProvider";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import "../../assets/css/dashboard.css";
import logo from "../../assets/images/logo.png";

// eslint-disable-next-line no-unused-vars
export default function Dashboard({children}) {
    const {
        userToken,
        setUserToken,
        currentUser,
        setCurrentUser,
        setprofile,
        profile,
    } = useStateContext();
    // eslint-disable-next-line no-unused-vars
    const [activeLinkIndex, setActiveLinkIndex] = useState(-1);
    const [isSidebarActive, setIsSidebarActive] = useState(false);


    const navigate = useNavigate(); // Get the navigate function from useNavigate hook


    if (!userToken || profile.name !== "admin") {
        return <Navigate to="/" />;
    }

    const logout = async () => {
        try {
          // Clear user-related state variables
          setCurrentUser(null); // Assuming this sets the current user to null
          setprofile(null); // Assuming this sets the profile to null
          setUserToken(null); // Assuming this sets the user token to null
      
          // Remove specific items from session storage
          sessionStorage.removeItem("privileges"); // Remove "privileges" from session storage
          sessionStorage.removeItem("roles"); // Remove "roles" from session storage
          sessionStorage.removeItem("usersData");
          // Navigate to the home page or the desired route after logging out
          navigate("/"); // Assuming this navigates to the home page ("/") using a router/navigation library
        } catch (error) {
          console.error("Error logging out:", error);
        }
      };

  
    const handleLinkHover = (index) => {
        setActiveLinkIndex(index);
    };

    const handleToggleClick = () => {
        setIsSidebarActive(!isSidebarActive);
    };


    


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        let list = document.querySelectorAll(".navigation li");
        list.forEach((item, index) => {
            item.addEventListener("mouseover", () => handleLinkHover(index));
            item.addEventListener("mouseout", () => setActiveLinkIndex(-1));
        });

        return () => {
            list.forEach((item, index) => {
                item.removeEventListener("mouseover", () =>
                    handleLinkHover(index)
                );
                item.removeEventListener("mouseout", () =>
                    setActiveLinkIndex(-1)
                );
            });
        };
    }, []);

    return (
        <div className="container">
            <div className={`navigation  ${isSidebarActive ? "active" : ""}`}>
                <ul className="mt-[10%]">
                    <li className="flex justify-center items-center">
                        <span className="icon">
                            <img
                                src={logo}
                                className="w-full h-full object-contain"
                                alt="Logo"
                            />
                        </span>
                    </li>
                    <li>
                        <a href="/dashboard">
                            <span className="icon">
                                <ion-icon name="home-outline"></ion-icon>
                            </span>
                            <span className="title">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="/dashboard/employes">
                            <span className="icon">
                                <ion-icon name="people-outline"></ion-icon>
                            </span>
                            <span className="title">Employes</span>
                        </a>
                    </li>
                   
                    <li>
                        <a href="/dashboard/client">
                            <span className="icon">
                                <ion-icon name="people-outline"></ion-icon>
                            </span>
                            <span className="title">Client</span>
                        </a>
                    </li>
                    <li>
                        <a href="/dashboard/projet">
                            <span className="icon">
                                <ion-icon name="code-outline"></ion-icon>
                            </span>
                            <span className="title">Projet</span>
                        </a>
                    </li>

                    <li>
                        <a href="/dashboard/formation">
                            <span className="icon">
                                <ion-icon name="school-outline"></ion-icon>
                            </span>
                            <span className="title">Formation</span>
                        </a>
                    </li>

                    <li>
                        <a href="/dashboard/profil">
                            <span className="icon">
                                <ion-icon name="newspaper-outline"></ion-icon>
                            </span>
                            <span className="title">Profil</span>
                        </a>
                    </li>

                    <li>
                        <a href="/dashboard/setting">
                            <span className="icon">
                                <ion-icon name="settings-outline"></ion-icon>
                            </span>
                            <span className="title">setting</span>
                        </a>
                    </li>

                    <li>
                        <a href="#" onClick={logout}>
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
                    <div className="flex flex-row gap-6 justify-center items-center">
                        <div className="flex-1">
                            <h1 className="text-[20px] font-bold">
                                {currentUser.name}
                            </h1>
                            <h1 className="text-[15px] font-bold text-blue-400">
                                {profile.name}
                            </h1>
                        </div>

                        <div className="user">
                            <img
                                className="flex-1"
                                src={currentUser.profile_picture}
                                alt="Profile Picture"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-2   flex  gap-10 flex-row justify-between flex-wrap">
                <Outlet />
                </div>
            </div>
        </div>
       
    );
}
