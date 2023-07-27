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
    
    const {
        userToken,
        setUserToken,
        setCurrentUser,
        setprofile,
        profile,
    } = useStateContext();

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
          const response = await axiosClient.get(`profiless/${profile.id}/privileges`);
          const privilegeIds = response.data.map((privilege) => privilege.status_id);
          const promises = privilegeIds.map((id) => axiosClient.get(`statuses/${id}`));
    
          const responses = await Promise.all(promises);
          const statusNames = new Set(responses.map((response) => response.data.name));
    
          const linksArray = Array.from(statusNames).map((statusName) => ({
            name: statusName,
            url: "/users/" + statusName.toLowerCase().replace(/\s/g, "-"),
          }));
    
          // Set the state after the data is successfully fetched
          setLinks(linksArray);
          setPrivilegeSettings(response.data[0].status_id);
          setLoading(false); // Set loading to false after successful data fetching
    
          // Now store the linksArray in local storage
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
          localStorage.removeItem("links"); // Remove the "links" entry from local storage
          navigate("/"); 
        } catch (error) {
          console.error("Error logging out:", error);
        }
      };

      return (
        <div className="container">
            <div className={`navigation flex flex-col justify-around`}>
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
                   {links.map((link , index)=>(
                         <li key={index}>
                         <a href={link.url}>
                             
                             <span className="title font-bold text-[20px]">{link.name}</span>
                         </a>
                     </li>
                   ))}
            
                </ul>
                <ul className="">
                    <li>
                       
                    </li>
                    <li>
                        <Link to="/users" >
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
            <div className={`main flex flex-col`}>
                <div className="flex-1 p-2  flex  gap-10 flex-row justify-between flex-wrap">
                <Outlet />
                </div>
            </div>
        </div>
    );
}