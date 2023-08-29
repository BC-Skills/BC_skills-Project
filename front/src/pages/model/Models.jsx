import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/contextProvider";

export default function Models({ onCloseModal, fetchUsersData }) {
    const [profiles, setProfiles] = useState([]);
    const [profilesid, setProfilesid] = useState({});
    const { profile } = useStateContext();

    useEffect(() => {
        axiosClient
            .get("profiles")
            .then((response) => {
                setProfiles(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

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

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('profile_picture', event.target.profile_picture.files[0]);
        console.log(formData);
        axiosClient
            .post("users", formData)
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Employee added successfully!");
                    event.target.reset();
                    window.location.reload();
                    sessionStorage.removeItem("usersData");
                    fetchUsersData();
                } else {
                    console.error("Failed to add employee:", response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error adding employee:", error);
            });
    };

    return (
        <>
            <div id="authentication-modal" aria-hidden="true" className="fixed ml-[35%] mt-[5%] z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="px-6 py-6 lg:px-8">
                            <div className="flex items-center justify-between pb-3">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add Employee</h3>
                                <button type="button" onClick={onCloseModal} data-modal-hide="edit-user-modal"  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Fermer
                                </button>
                            </div>
                            <form className="space-y-6" action="#" id="addEmployeeForm" onSubmit={handleSubmit} encType="multipart/form-data">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                    <input type="text" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Name" required />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input type="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                                </div>
                                {/* <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="••••••••" required />
                                </div> */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Picture</label>
                                    <input type="file" name="profile_picture" accept="image/*" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telephone</label>
                                    <input type="numeric" name="tel" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Telephone" required />
                                </div>
                                <div>
                                    {profile.name === "admin" ? (
                                        <>
                                            <label htmlFor="profil" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile</label>
                                            <div>
                                                <select name="profile_id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                                                    {profiles.map((profile) => (
                                                        <option key={profile.id} value={profile.id}>
                                                            {profile.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-900 text-[30px] dark:text-white">
                                            <input type="hidden" name="profile_id" value={profilesid} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="button" onClick={onCloseModal} className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        Cancel
                                    </button>
                                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        ADD
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
