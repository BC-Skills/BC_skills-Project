/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axiosClient from "../../../../axios";
import PropTypes from "prop-types";
import { useStateContext } from "../../../../contexts/contextProvider"

Cardtickes.propTypes = {
    tickets: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nom: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        sprint_id: PropTypes.number,
        project_id: PropTypes.number.isRequired,
        user_id: PropTypes.number.isRequired,
        created_at: PropTypes.string.isRequired,
        updated_at: PropTypes.string.isRequired,
        assign_to: PropTypes.number,
        project: PropTypes.shape({
            // Define the prop types for the 'project' object, if applicable
        }),

        user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            profile_picture: PropTypes.string.isRequired,
            email_verified_at: PropTypes.string, // If email_verified_at can be null, use PropTypes.string
            created_at: PropTypes.string.isRequired,
            updated_at: PropTypes.string.isRequired,
            tel: PropTypes.string.isRequired,
            profile_id: PropTypes.number.isRequired,
        }),
        // Add prop types for the 'assignedToUser' object
    }).isRequired,
    assigned_to_user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        profile_picture: PropTypes.string.isRequired,
        email_verified_at: PropTypes.string,
        created_at: PropTypes.string.isRequired,
        updated_at: PropTypes.string.isRequired,
        tel: PropTypes.string.isRequired,
        profile_id: PropTypes.number.isRequired,
    }),
    sprint: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
};
// eslint-disable-next-line react/prop-types
export default function Cardtickes({ tickets, fetchticketsData , selectedProject , modifuy}) {
    const [showUserList, setShowUserList] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const { currentUser } = useStateContext();





    const handleImageClick = (user) => {
        setSelectedUser(user);
        fetchUsersData(currentUser.id);

        setShowUserList(true);
    };

    const handleCloseModal = () => {
        setShowUserList(false);
        setSelectedUser(null);
    };





    const fetchUsersData = async (currentUserid) => {
        try {
            const response = await axiosClient.get(`userss/exadminclient/${currentUserid}`);
            const usersData = response.data;
            setUsers(usersData);
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };

    const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
);

    const updateTicketWithUser = async () => {
        try {
            if (selectedUser) {
                await axiosClient.put(`ticketss/${tickets.id}`, {
                    assign_to: selectedUser.id,
                });
                
                fetchticketsData();
                console.log("Ticket updated successfully.");
                setShowUserList(false);
            }
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };

    const [showActions, setShowActions] = useState(false);

    const handleShowActions = () => {
        setShowActions(true);
    };

    const handleHideActions = () => {
        setShowActions(false);
    };

    const deleteTicket = async () => {
        try {
            await axiosClient.delete(`tickets/${tickets.id}`);
            console.log("Ticket deleted successfully.");
            fetchticketsData();
        } catch (error) {
            console.error("Error deleting ticket:", error);
        }
    };

    const [showSprintList, setShowSprintList] = useState(false);

    const handleSprintClick = () => {
        fetchSprintsData();
        setShowSprintList(true);
    };

    const handleCloseSprintList = () => {
        setShowSprintList(false);
    };

    const [selectedSprint, setSelectedSprint] = useState(null);

    const handleSprintSelection = (sprint) => {
        setSelectedSprint(sprint);
    };

    const updateTicketWithSprint = async () => {
        try {
            if (selectedSprint) {
                await axiosClient.put(`tickets/${tickets.id}`, {
                    sprint_id: selectedSprint.id,
                });
                fetchticketsData();
                console.log(
                    "Ticket updated successfully with the selected sprint."
                );
                setShowSprintList(false);
            }
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };

    const [sprints, setSprints] = useState([]);
    const fetchSprintsData = async () => {
        try {
            const response = await axiosClient.get(`sprintss/${selectedProject}`);
            const sprintsData = response.data;
            setSprints(sprintsData);
        } catch (error) {
            console.log("Error fetching sprints:", error);
        }
    };

    return (
        <div className="flex-1 max-h-[180px] flex flex-col p-2 rounded-2xl shadow-xl bg-gray-200 group">
            <div className="flex-1 flex flex-row items-center justify-center">
                <h1 className="flex-1 text-[25px] h-10 mt-2 ml-12">
                    {tickets.nom}
                </h1>
                <div
                    className="p-3 m-2 bg-gray-400 hidden group-hover:block relative"
                    onMouseEnter={handleShowActions}
                    onMouseLeave={handleHideActions}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-ellipsis"
                        viewBox="0 0 16 16"
                    >
                        <circle cx="8" cy="8" r="1.5" />
                        <circle cx="12" cy="8" r="1.5" />
                        <circle cx="4" cy="8" r="1.5" />
                    </svg>
                    {showActions && (
                        <div className="absolute top-0 left-0 mt-12  bg-white rounded-md shadow-md">
                            <button
                                className="p-2 w-full text-left border border-gray-300 bg-purple-100"
                                onClick={modifuy ? deleteTicket : undefined} 

                            >
                                Supprimer
                            </button>
                            <button
                                className="p-2 w-full text-left border border-gray-300 bg-orange-100"
                                onClick={modifuy ? handleSprintClick : undefined} 

                            >
                                Assign To Sprint
                            </button>
                            <button className="p-2 w-full text-left border border-gray-300 bg-blue-100">
                                More Details
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 pr-6 pl-6 flex flex-row justify-evenly items-center">
                From to :{" "}
                <span className="text-orange-400 text-[20px]">
                    {tickets?.user?.name}
                </span>
                <div className="relative p-3 m-2 w-8 h-8">
                    <img
                        src={tickets.user?.profile_picture}
                        alt="Image"
                        className="cursor-pointer absolute top-0 left-0 w-full h-full rounded-full object-cover"
                    />
                </div>
                assign to:{" "}
                {tickets?.assigned_to_user?.name ? (
                    <span className="text-orange-400 text-[20px]">
                        {tickets?.assigned_to_user?.name}
                    </span>
                ) : (
                    <span className="text-gray-400">no yet</span>
                )}{" "}
                <div className="relative p-3  m-2 w-8 h-8">
                    <img
                        src={
                            tickets?.assigned_to_user?.profile_picture
                                ? tickets?.assigned_to_user?.profile_picture
                                : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png"
                        }
                        alt={tickets?.assigned_to_user?.name}
                        className="cursor-pointer absolute top-0 left-0 w-full h-full rounded-full object-cover"
                        onClick={modifuy ? handleImageClick : undefined} // Disable the onClick if modifuy is false
                        />
                    {showUserList && (
                        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
                            <div className="bg-white rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Assign to
                                    </h2>
                                    <button
                                        className="text-gray-500"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                </div>
                                <div
                                    className="max-h-80 overflow-y-auto grid grid-cols-3 gap-4"
                                    style={{ maxHeight: "20rem" }}
                                >
                                    {filteredUsers.map((user) => (
                                        <div
                                            key={user.name}
                                            className="flex flex-col items-center p-2 border rounded-md cursor-pointer"
                                            onClick={() => {
                                                handleImageClick(user);
                                                updateTicketWithUser();
                                            }}
                                        >
                                            <img
                                                src={user.profile_picture}
                                                alt={user.name}
                                                className="w-16 h-16 rounded-full object-cover mb-2"
                                            />
                                            <span>{user.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 ml-8 text-orange-400 text-[20px] pr-6 pl-6 flex mt-4 flex-row justify-Start items-center">
                <span className=" text-black text-[15px]">Sprint : </span>
                {tickets?.sprint?.name  ? (
                    <span className="text-orange-400 text-[20px]">
                        {tickets?.sprint?.name }
                    </span>
                ) : (
                    <span className="text-gray-400"> without sprint</span>
                )}{" "}
            </div>
            {showSprintList && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Sprints</h2>
                            <button
                                className="text-gray-500"
                                
                                onClick={handleCloseSprintList}
                            >
                                Close
                            </button>
                        </div>
                        <div
                            className="max-h-80 overflow-y-auto grid grid-cols-3 gap-4"
                            style={{ maxHeight: "20rem" }}
                        >
                            {sprints.map((sprint) => (
                                <div
                                    key={sprint.id}
                                    className={`flex flex-col items-center p-2 border rounded-md cursor-pointer ${
                                        selectedSprint?.id === sprint.id
                                            ? "bg-blue-200"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleSprintSelection(sprint)
                                    }
                                >
                                    <span>{sprint.name}</span>
                                </div>
                            ))}
                        </div>
                        {selectedSprint && (
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={updateTicketWithSprint}
                            >
                                Assign Sprint
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
// Update the prop types definition
