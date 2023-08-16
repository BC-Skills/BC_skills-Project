/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/contextProvider";

// eslint-disable-next-line no-unused-vars
export default function EditModels({ userId, onCloseModal, fetchUsersData }) {
    const [editedUser, setEditedUser] = useState({
        name: "",
        email: "",
        tel: "",
        profile_id: null,
        password: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedUser((prevEditedUser) => ({
            ...prevEditedUser,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (userId) {
            fetchUserData(userId);
            sessionStorage.removeItem("usersData");
        }
    }, [userId]);

    const fetchUserData = (userId) => {
        axiosClient
            .get(`users/${userId}`)
            .then((response) => {
                const { name, email, tel, password } = response.data;
                setEditedUser({ name, email, tel, password });
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Create an updated user object
        const updatedUser = {
            name: editedUser.name,
            email: editedUser.email,
            tel: editedUser.tel,
            profile_id: editedUser.profile_id,
            password: editedUser.password,
        };

        // Send a PUT request using axios to update the user
        axiosClient
            .put(`users/${userId}`, updatedUser)
            .then((response) => {
                console.log("User updated:", response.data);
                onCloseModal(); // Close the modal after successful submission
                location.reload(); // This might not be the best practice; consider updating the user data in the state instead.
            })
            .catch((error) => {
                console.error("Error updating user:", error);
            });
    };
    const { profile } = useStateContext();
    const [profilesid, setProfilesid] = useState({});

    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        axiosClient
            .get("profiles")
            .then((response) => {
                setProfiles(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    
    useEffect(() => {
        if (profile.name !== "admin") {
            axiosClient
                .get("profiless/get-profile-id?profile_name=Client")
                .then((response) => {
                    setProfilesid(response.data.profile_id);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [profile.name]);

    return (
        <div
            id="edit-user-modal"
            tabIndex={-1}
            className="fixed inset-0 flex items-center  justify-center z-50"
        >
            <div className="modal-overlay  absolute inset-0 bg-gray-500 opacity-75" />
            <div className="modal-container bg-white w-full max-w-md mx-auto rounded shadow-lg z-50">
                <div className="modal-content py-4 text-left px-6">
                    {/* Modal header */}
                    <div className="flex items-center justify-between pb-3">
                        <h3 className="text-lg font-medium">Edit User</h3>
                        <button
                            type="button"
                            onClick={onCloseModal}
                            data-modal-hide="edit-user-modal"
                            className="text-gray-700 hover:text-gray-900 focus:outline-none"
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
                    {/* Modal body */}
                    <form onSubmit={handleSubmit} id="edit-user-form">
                        {/* Edit input fields and form elements for editing user information */}
                        <div className="mb-4">
                            <label
                                htmlFor="edit-name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="edit-name"
                                name="name"
                                value={editedUser.name}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Enter name"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="edit-email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="edit-email"
                                name="email"
                                value={editedUser.email}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="edit-tel"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Telephone
                            </label>
                            <input
                                type="tel"
                                id="edit-tel"
                                name="tel"
                                value={editedUser.tel}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Enter telephone number"
                            />
                        </div>
                        <div className="mb-4">
                          
                            {profile.name === "admin" ? (
                                        <>
                                    <label
                                htmlFor="profil"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                            >
                                Profile
                            </label>  
                                <div>
                                   
                                    <select
                                        name="profile_id"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        required
                                    >
                                        {profiles.map((profile) => (
                                            <option key={profile.id} value={profile.id}>
                                                {profile.name}
                                            </option>
                                        ))}
                                    </select>
                                </div></>
                            ) : (
                                <div className="text-gray-900 text-[30px] dark:text-white">
                                      <input
                                    type="hidden"
                                    name="profile_id"
                                    value={profilesid}
                                />
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="edit-password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="edit-password"
                                name="password"
                                value={editedUser.password}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Enter password"
                            />
                        </div>
                        {/* Modal footer */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={onCloseModal}
                                className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                id="edit-user-submit-button"
                                data-user-id="dataid"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
