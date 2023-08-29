import React, { useState, useEffect } from "react";
import { useStateContext } from "../../../contexts/contextProvider";
import axiosClient from "../../../axios";
import { Transition } from "@headlessui/react";

const ProfilePage = () => {
    const { currentUser, profile, setCurrentUser } = useStateContext();
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [passwordUpdateStatus, setPasswordUpdateStatus] = useState(null);
    const [userCompetences, setUserCompetences] = useState([]);
    const competenceColors = ["#FF9300", "#983FFB", "#068FF1", "#05EB07"];

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post(
                `users/${currentUser.id}/update-password`,
                {
                    newPassword: newPassword,
                }
            );
            setPasswordUpdateStatus("success");
            console.log(response.data);
            setShowChangePasswordForm(false);
        } catch (error) {
            setPasswordUpdateStatus("error");
            console.error("Error updating password:", error);
        }
    };
    useEffect(() => {
        fetchUserCompetences(currentUser.id);
    }, [currentUser.id]);

    const fetchUserCompetences = async (userId) => {
        try {
            const response = await axiosClient.get(
                `/userss/${userId}/competences`
            );
            setUserCompetences(response.data);
        } catch (error) {
            console.error("Error fetching user competences:", error);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("profile_picture", file);
        try {
            const response = await axiosClient.post(
                `/userss/${currentUser.id}/update-profile-picture`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            // Handle success
            console.log("Profile picture updated:", response.data);
            setCurrentUser(response.data);
        } catch (error) {
            // Handle error
            console.error("Error updating profile picture:", error);
        }
    };

    return (
        <div className="min-h-screen flex-1 bg-white-100 py-6 flex flex-col items-center justify-center sm:py-12">
            <div className="relative md:min-w-[700px] lg:min-w-[1000px] py-3">
                <div className="absolute inset-0 bg-gradient-to-r rounded-3xl overflow-hidden from-ff9300 via-983ffb to-068ff1 to-05eb07 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 rounded-3xl overflow-hidden bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-center">
                            <Transition
                                show={true}
                                enter="transition-opacity duration-1000"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            ></Transition>
                        </div>
                        <div className="text-center">
                            <img
                                src={currentUser.profile_picture}
                                className="mx-auto mb-4 w-32 rounded-lg "
                                alt="Avatar"
                            />
                            <h5 className="mb-2 text-xl font-medium leading-tight">
                                {" "}
                                {currentUser.name}
                            </h5>
                            <p className="text-neutral-500 dark:text-neutral-400">
                                {" "}
                                {profile && profile.name}
                            </p>
                            <p className="text-neutral-500 dark:text-neutral-400">
                                {" "}
                                Email: {currentUser.email}
                            </p>
                            <p className="text-neutral-500 dark:text-neutral-400">
                                {" "}
                                Tel: {currentUser.tel}
                            </p>
                        </div>
                        {/* Display user's competences badges */}
                        <div className="mt-4 flex ml-[16%] mr-[16%] justify-center space-x-2 max-w-[300px] flex-wrap gap-4 items-center">
                            {userCompetences.map((competence, index) => (
                                <span
                                    key={competence.id}
                                    style={{
                                        backgroundColor:
                                            competenceColors[
                                                index % competenceColors.length
                                            ],
                                        color: "#fff", // You can adjust the text color as needed
                                    }}
                                    className="inline-block rounded whitespace-nowrap px-2 py-1 text-xs font-semibold"
                                >
                                    {competence.name}
                                </span>
                            ))}
                        </div>

                        {/* <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex justify-center">
                  <h2 className="text-xl leading-6 font-medium text-gray-900">
                    {currentUser.name}
                  </h2>
                </div>
                <div className="flex justify-center">
                  <h2 className="text-xl leading-6 font-medium text-gray-900">
                    {profile && profile.name}
                  </h2>
                </div>
                <div className="flex justify-center">
                  <p>Email: {currentUser.email}</p>
                </div>
                <div className="flex justify-center">
                  <p></p>
                </div>
              </div>
            </div> */}
                        <div className="mt-10">
                            <button
                                onClick={() =>
                                    setShowChangePasswordForm(
                                        !showChangePasswordForm
                                    )
                                }
                                className="bg-[#41415A] hover:bg-[#6C6D96]  text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                            >
                                Changer le mot de passe
                            </button>
                            {passwordUpdateStatus === "success" && (
                                <p className="text-green-500 mt-2">
                                    Password updated successfully!
                                </p>
                            )}
                            {passwordUpdateStatus === "error" && (
                                <p className="text-red-500 mt-2">
                                    An error occurred while updating the
                                    password.
                                </p>
                            )}
                            <Transition
                                show={showChangePasswordForm}
                                enter="transition-opacity duration-500"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <form onSubmit={handlePasswordChange}>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="newPassword"
                                            className="block font-bold mb-1"
                                        >
                                            Nouveau Mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                            className="border border-gray-400 px-4 py-2 rounded w-full"
                                            required
                                        />
                                    </div>
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowChangePasswordForm(false)
                                            }
                                            className="text-gray-500 mr-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-[#41415A] hover:bg-[#6C6D96]  text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </Transition>
                        </div>
                        <div className="mt-10">
                            <div className="mb-4">
                                <label
                                    htmlFor="profilePicture"
                                    className="block font-bold mb-1"
                                >
                                    Changer la Photo de profile
                                </label>
                                <input
                                    type="file"
                                    id="profilePicture"
                                    name="profile_picture" // This should match the field name in the backend
                                    onChange={handleFileChange}
                                    className="border border-gray-400 px-4 py-2 rounded w-full"
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
