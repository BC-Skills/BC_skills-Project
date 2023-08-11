import { useEffect, useRef, useState } from "react";
import Models from "../../model/Models";
import axiosClient from "../../../axios";
import EditModels from "../../model/EditModels";


export default function Employe() {
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state
    const [editModalOpen, setEditModalOpen] = useState(false); // New state variable for the EditModels modal
    const [selectedUserId, setSelectedUserId] = useState(null); // New state variable to store the ID of the selected user

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Function to open the EditModels modal
    const handleOpenEditModal = (userId) => {
        setSelectedUserId(userId); // Set the selected user ID
        setEditModalOpen(true); // Open the modal
    };

    // Function to close the EditModels modal
    const handleCloseEditModal = () => {
        setSelectedUserId(null); // Clear the selected user ID
        setEditModalOpen(false); // Close the modal
    };

 


    useEffect(() => {
        const storedUsersData = sessionStorage.getItem("usersData");

        if (storedUsersData) {
          setUsers(JSON.parse(storedUsersData));
          setLoading(false);
        } else {
          fetchUsersData();
        }
      }, []);
      

    const fetchUsersData = async () => {
        try {
          const response = await axiosClient.get("users");
          const usersData = response.data;
          setUsers(usersData);
            console.log(usersData)
          // Store the user data in session storage
          sessionStorage.setItem("usersData", JSON.stringify(usersData));
      
          // Fetch profile data for each user
          
          setLoading(false); // Set loading to false once the data is fetched
        } catch (error) {
          console.error("Error fetching users:", error);
          setLoading(false); // Set loading to false if there's an error
        }
      };
      

    function deleteUser(userId) {
        axiosClient
            .delete(`users/${userId}`)
            .then((response) => {
                if (response.status === 200 || response.status === 204) {
                    console.log("User deleted successfully!");
                    window.location.reload();
                } else {
                    console.error(
                        "Error deleting the user:",
                        response.statusText
                    );
                }
            })
            .catch((error) => {
                console.error("Error deleting the user:", error);
            });
    }

    const handleSearchChange = (searchText, tableRows) => {
        searchText = searchText.toLowerCase();
        for (let i = 1; i < tableRows.length; i++) {
            const rowData = tableRows[i].textContent.toLowerCase();
            if (rowData.includes(searchText)) {
                tableRows[i].style.display = "";
            } else {
                tableRows[i].style.display = "none";
            }
        }
    };

    const handleSearch = () => {
        const searchText = searchInputRef.current.value;
        const employeeTable = document.getElementById("employeeTable");
        const tableRows = employeeTable.getElementsByTagName("tr");
        handleSearchChange(searchText, tableRows);
    };

    // Create a ref for the search input element
    const searchInputRef = useRef(null);

    // Add an event listener to the search input element
    useEffect(() => {
        const searchInput = searchInputRef.current;
        if (searchInput) {
            searchInput.addEventListener("input", handleSearch);
        }

        // Remove the event listener when the component unmounts
        return () => {
            if (searchInput) {
                searchInput.removeEventListener("input", handleSearch);
            }
        };
    }, []);

    return (
        <div className="flex-1 flex flex-col  pt-10 gap-6 ">
            <div className=" ml-[2%] mr-[2%] pl-32 pr-32 flex justify-between items-center  rounded-xl">
                <div className="mt-5 mb-2 border-2 py-1 px-3 flex justify-between  rounded-md hover:border-blue-500">
                    <input
                        ref={searchInputRef}
                        id="searchInput"
                        className="flex-grow outline-none text-gray-600 focus:text-blue-600"
                        type="text"
                        placeholder="Search Employee..."
                    />
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-400 focus:text-blue-400 transition duration-100 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {" "}
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                </div>
                <div className="">
                    <button
                        type="button"
                        onClick={handleShowModal}
                        className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-blue-900 to-voilet-500 sm:ml-auto shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                    >
                        <svg
                            className="mr-2 -ml-1 w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"></path>
                        </svg>
                        Add user
                    </button>
                </div>
            </div>
            <div className="bg-gray-4 flex-1 drop-shadow-xl shadow-gray-300">
                <div className="flex flex-col my-6 mx-4 rounded-2xl shadow-xl shadow-gray-200">
                    <div className="overflow-x-auto rounded-2xl">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden shadow-lg">
                                {loading ? ( // Show loading message or spinner when loading is true
                                    <div className="flex-1 flex justify-center items-center">
                                        <div className=" w-16 h-16 border-4 border-t-transparent border-red-400 border-double rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <table
                                        className="min-w-full divide-y divide-gray-200 table-fixed"
                                        id="employeeTable"
                                    >
                                        <thead className="bg-white">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="p-4 text-xs font-medium text-left text-gray-500 uppercase lg:p-5"
                                                >
                                                    Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="p-4 text-xs font-medium text-left text-gray-500 uppercase lg:p-5"
                                                >
                                                    Profil
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="p-4 text-xs font-medium text-left text-gray-500 uppercase lg:p-5"
                                                >
                                                    Telephone
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="p-4 lg:p-5"
                                                ></th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            className="bg-white divide-y divide-gray-200"
                                            id="user-list"
                                        >
                                            {users.map((user) => (
                                                <tr
                                                    className="hover:bg-gray-100"
                                                    key={user.id}
                                                >
                                                    <td className="flex items-center gap-3 p-4 mr-12 space-x-6 whitespace-nowrap lg:p-5 lg:mr-0">
                                                        <img
                                                            className="w-8 h-8 rounded-full"
                                                            src={
                                                                user.profile_picture
                                                            }
                                                            alt={`${user.name} avatar`}
                                                        />
                                                        <div className="text-sm font-normal text-gray-500">
                                                            <div className="text-base font-semibold text-gray-900">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm font-normal text-gray-500">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="p-4 text-base font-medium text-gray-900 whitespace-nowrap lg:p-5"
                                                        
                                                    >
                                                        <div className="flex gap-2">
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-500 px-2 py-1 text-xs font-semibold text-white">
                                                            {user.profile_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap lg:p-5">
                                                        {user.tel}
                                                    </td>
                                                    <td className="p-4 space-x-4 whitespace-nowrap lg:p-5">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenEditModal(
                                                                    user.id
                                                                )
                                                            }
                                                            className="edit-user-button inline-flex items-center py-2 px-3 text-sm font-medium text-center text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 hover:text-gray-900 hover:scale-[1.02] transition-all"
                                                        >
                                                            <svg
                                                                className="mr-2 w-5 h-5"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                                                                <path d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                                                            </svg>
                                                            <span>
                                                                Edit user
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteUser(
                                                                    user.id
                                                                )
                                                            }
                                                            className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-black rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                                                        >
                                                            <svg
                                                                className="mr-2 w-5 h-5"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"></path>
                                                            </svg>
                                                            <span>
                                                                Delete user
                                                            </span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <Models onCloseModal={handleCloseModal} fetchUsersData={fetchUsersData} />}
            {editModalOpen && (
                <EditModels
                    userId={selectedUserId}
                    onCloseModal={handleCloseEditModal}
                    fetchUsersData={fetchUsersData}
                />
            )}
        </div>
    );
}
