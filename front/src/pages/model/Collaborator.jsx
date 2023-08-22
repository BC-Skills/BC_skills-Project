/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/contextProvider";

// eslint-disable-next-line no-unused-vars
export default function Collaborator({ project, onCloseModal }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchInputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState([]); // Step 1: State for selected user IDs

    const { currentUser } = useStateContext();


    const handleSearch = () => {
        const searchText = searchInputRef.current.value.toLowerCase();
        setSearchQuery(searchText);
    };

    useEffect(() => {
       
            fetchUsersData(currentUser.id);
        
    }, []);

    const fetchUsersData = async (currentUserid) => {
        try {
            const response = await axiosClient.get(`userss/exadminclient/${currentUserid}`);
            const usersData = response.data;
            setUsers(usersData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const filteredUsers = users.filter((user) => {
            return (
                user.name.toLowerCase().includes(searchQuery) ||
                user.email.toLowerCase().includes(searchQuery) ||
                user.tel.toLowerCase().includes(searchQuery) ||
                user.profile_name.toLowerCase().includes(searchQuery)
            );
        });

        setFilteredUsers(filteredUsers);
    }, [searchQuery, users]);







    const handleCheckboxChange = async (userId, checked) => {
        if (checked) {
          setSelectedUserIds((prevSelectedUserIds) =>
            prevSelectedUserIds.includes(userId)
              ? prevSelectedUserIds
              : [...prevSelectedUserIds, userId]
          );
      
          // Attach user to the project
          try {
            await axiosClient.post(`projects/${project.id}/users/attach`, {
              users: [userId],
            });
            // Handle success or update the UI if needed
          } catch (error) {
            console.error("Error attaching user:", error);
          }
        } else {
          setSelectedUserIds((prevSelectedUserIds) =>
            prevSelectedUserIds.filter((id) => id !== userId)
          );
      
          // Detach user from the project
          try {
            await axiosClient.post(`projects/${project.id}/users/detach`, {
              users: [userId],
            });
            // Handle success or update the UI if needed
          } catch (error) {
            console.error("Error detaching user:", error);
          }
        }
      };


    // Function to fetch project users
    useEffect(() => {
        fetchProjectUsers(); // Fetch project users after initial data is loaded
      }, [users]); // Only run this effect when users data changes
    
      const fetchProjectUsers = async () => {
        try {
          const response = await axiosClient.get(`projects/${project.id}/users`);
          const projectUsers = response.data;
          setSelectedUserIds((prevSelectedUserIds) => {
            return projectUsers.map((user) => user.id); // Update selectedUserIds with project users
          });
        } catch (error) {
          console.error("Error fetching project users:", error);
        }
      };

    return (
        <>
            <div
                id="authentication-modal"
                aria-hidden="true"
                className="fixed ml-[17%] mt-[2%] z-50 w-full p-4  overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full "
            >
                <div className="relative w-full max-w-[1200px] bg max-h-full ">
                    <div className="relative rounded-3xl shadow-2xl bg-gray-100">
                        <div className="px-6 py-6 lg:px-8">
                            <div className="flex items-center justify-between pb-3">
                                <h3 className="mb-4 text-[30px] font-bold text-gray-900 dark:text-black">
                                    Collaborator
                                </h3>
                                <button
                                    type="button"
                                    onClick={onCloseModal}
                                    data-modal-hide="edit-user-modal"
                                    className="text-gray-500 hover:text-black  focus:outline-none"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="m6 18 12-12M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 flex flex-row gap-9 h-[60vh]">
                                <div className="flex-1 flex-col flex">
                                    <div className="flex flex-row justify-between items-center">
                                        <h1 className="text-[30px] font-bold">
                                            Employe
                                        </h1>
                                        <div className="mt-5 mb-2 border-2 py-1 px-3 flex justify-between  rounded-md hover:border-blue-500">
                                            <input
                                                ref={searchInputRef}
                                                id="searchInput"
                                                className="flex-grow outline-none text-gray-600 focus:text-blue-600"
                                                type="text"
                                                placeholder="Search Employee..."
                                                onChange={handleSearch} // Add onChange event listener to trigger filtering
                                            />
                                            <span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-gray-400 focus:text-blue-400 transition duration-100 cursor-pointer"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-gray-200 shadow-2xl rounded-2xl flex flex-col gap-3 pt-6 px-3 overflow-y-auto">
                                        {loading ? (
                                            <p>Loading users...</p>
                                        ) : (
                                            <div className="grid gap-3 lg:grid-cols-2 md:grid-cols-2">
                                                {filteredUsers.map((user) => {
                                                    return (
                                                        <div
                                                            key={user.id}
                                                            className="bg-white h-32 rounded-xl p-4 flex items-center justify-between"
                                                        >
                                                            <div className="bg-white h-32 rounded-xl p-4 flex items-center">
                                                                <div className="w-16 h-16 mr-4">
                                                                    <img
                                                                        src={
                                                                            user.profile_picture
                                                                        }
                                                                        alt="Profile"
                                                                        className="w-full h-full rounded-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <h2 className="text-lg font-bold">
                                                                        {
                                                                            user.name
                                                                        }
                                                                    </h2>
                                                                    <p>
                                                                        Email:{" "}
                                                                        {
                                                                            user.email
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        Phone:{" "}
                                                                        {
                                                                            user.tel
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        Profile:{" "}
                                                                        {
                                                                            user.profile_name
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3 items-center">
                                                                <label className="switch">
                                                                <input
      type="checkbox"
      checked={selectedUserIds.includes(user.id)} // Checkbox is checked if the user is associated with the project
      onChange={(e) => handleCheckboxChange(user.id, e.target.checked)}
    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
