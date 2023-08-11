import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/contextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import "../../assets/css/dashboard.css";
import logo from "../../assets/images/logo.png";

export default function DashboardUser() {
    // eslint-disable-next-line no-unused-vars
    const [privilegeSettings, setPrivilegeSettings] = useState({});
    const [links, setLinks] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    const { userToken, setUserToken, setCurrentUser, setprofile, profile } =
        useStateContext();

    // eslint-disable-next-line no-unused-vars
    const [activeLinkIndex, setActiveLinkIndex] = useState(-1);
    const [isSidebarActive, setIsSidebarActive] = useState(false);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  

    const getPrivilages = async () => {
      try {
        const response = await axiosClient.get(
          `profiless/${profile.id}/privileges`
        );
        const privilegeIds = response.data.map((privilege) => privilege.status_id);
        const promises = privilegeIds.map((id) =>
          axiosClient.get(`statuses/${id}`)
        );
    
        const responses = await Promise.all(promises);
        const statusNames = responses.map((response) => response.data.name);
        const uniqueStatusNames = Array.from(new Set(statusNames));

        const linksArray = uniqueStatusNames.map((statusName, index) => {
          const url = "/users/" + statusName.toLowerCase().replace(/\s/g, "-");
          const logo = statusName.toLowerCase(); // Assuming the logo name follows this pattern
    
          let attribute = "";
    
          // Compare the status name with the static const variables
          if (statusName === 'projets') {
            attribute = "code-outline";
          } else if (statusName === 'formation') {
            attribute = "newspaper-outline";
          } else if (statusName === 'schedules') {
            attribute = "calendar-outline";
          } else if (statusName === 'tickets') {
            attribute = 'ticket-outline';
          } else if (statusName === 'users') {
            attribute = 'people-outline';
          }
    
          return {
            name: statusName,
            url,
            logo,
            attribute,
            id: index,
          };
        });
    
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
          setLoading(false); // Set loading to false in case of an error
        }
      }
    };

    const logout = async () => {
        try {
            setCurrentUser(null);
            setprofile(null);
            setUserToken(null);
            sessionStorage.clear();
            localStorage.clear();
                    navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

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
                    {links.map((link) => (
                        <li key={link.id}>
                            <a href={link.url}>
                                <span className="icon">
                                    <ion-icon name={link.attribute}></ion-icon>
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
                        <a href="/" onClick={logout}>
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
                    </div>
                </div>
                <div className="flex-1 p-2 flex  gap-10 flex-row justify-between flex-wrap">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
