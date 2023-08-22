/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axiosClient from "../../axios";

DetailsProject.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nom: PropTypes.string.isRequired,
        duree: PropTypes.number.isRequired,
    }).isRequired,
    onCloseModal: PropTypes.func.isRequired,
};

export default function DetailsProject({ project, onCloseModal }) {
    const [us, setUs] = useState([]);

    // Function to fetch user data from the API
    const fetchUserData = async () => {
        try {
            const response = await axiosClient.get(
                `projects/${project.id}/users`
            );
            const usersData = response.data;
            setUs(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const [sprints, setSprints] = useState([]);

    const fetchSprints = async () => {
        try {
            const response = await axiosClient.get(`sprintss/${project.id}`);
            const sprintsData = response.data;
            setSprints(sprintsData);
        } catch (error) {
            console.error("Error fetching sprints:", error);
        }
    };

    // Update the useEffect to fetch sprints when proje.id changes
    useEffect(() => {
        if (project) {
            fetchSprints();
        }
    }, [project]);

    const [showDescriptionId, setShowDescriptionId] = useState(null);

    const toggleDescription = (id) => {
        if (showDescriptionId === id) {
            setShowDescriptionId(null);
        } else {
            setShowDescriptionId(id);
        }
    };

    return (
        <>
            <div
                id="authentication-modal"
                aria-hidden="true"
                className="fixed ml-[25%] mt-[2%] z-50 w-full p-4  overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full "
            >
                <div className="relative w-full max-w-[800px] bg max-h-full ">
                    <div className="relative rounded-3xl shadow-2xl bg-gray-100">
                        <div className="px-6 py-6 lg:px-8">
                            <div className="flex items-center justify-between pb-3">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                                    Details
                                </h3>
                                <button
                                    type="button"
                                    onClick={onCloseModal}
                                    data-modal-hide="edit-user-modal"
                                    className="text-gray-500 hover:text-black focus:outline-none"
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
                            <div className="flex-1">
                                <div className="flex flex-row justify-between items-center">
                                    <h1 className="text-[35px] text-blue-800 font-bold font-serif">
                                        {project.nom}
                                    </h1>
                                    <h1 className="text-[25px] text-blue-800 font-bold font-serif">
                                        Durre : {project.duree}/Months
                                    </h1>
                                </div>
                                <div className="flex-1 flex flex-row gap-4">
                                    <div className=" flex-1 flex flex-row-reverse  items-center">
                                        <div className="flex-1">
                                            <h1 className="text-[20px] font-bold">
                                                {project.client?.name}
                                            </h1>
                                            <h1 className="text-[15px] font-bold">
                                                Email: {project.client?.email}
                                            </h1>
                                            <h1 className="text-[15px] font-bold">
                                                tele : {project.client?.tel}
                                            </h1>
                                        </div>
                                        <div className="relative w-16 h-16">
                                            <img
                                                src={
                                                    project.client
                                                        ?.profile_picture
                                                }
                                                alt="Image"
                                                className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="w-20 text-black font-bold">
                                            Client:
                                        </div>
                                    </div>
                                    <div className=" flex-1 flex flex-row-reverse gap-2 items-center">
                                        <div className="flex-1">
                                            <h1 className="text-[20px] font-bold">
                                                {project.project_manager?.name}
                                            </h1>
                                            <h1 className="text-[15px] font-bold">
                                                Email:{" "}
                                                {project.project_manager?.email}
                                            </h1>
                                            <h1 className="text-[15px] font-bold">
                                                tele :{" "}
                                                {project.project_manager?.tel}
                                            </h1>
                                        </div>
                                        <div className="relative w-16 h-16">
                                            <img
                                                src={
                                                    project.project_manager
                                                        ?.profile_picture
                                                }
                                                alt="Image"
                                                className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="w-20 text-black font-bold">
                                            Manager:
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-blue-800 font-bold text-[30px] text-center ">
                                        {" "}
                                        Description:
                                    </h1>
                                    <p className="text-black text-[2s5px] font-bold">
                                        {project.description}
                                    </p>
                                </div>
                                <div className="flex-1 text-center ">
                                    <h1 className="text-blue-800 font-bold text-[35px]">
                                        Collaborateur
                                    </h1>
                                    <div className="grid grid-cols-12 gap-1">
                                        {us.slice(0, 9).map((user, index) => (
                                            <img
                                                key={index}
                                                className="object-cover w-14 h-14 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                                                src={user.profile_picture}
                                                alt=""
                                            />
                                        ))}
                                        <p className="flex items-center justify-center w-14 h-14 -mx-1 text-xs text-blue-600 bg-blue-100 border-2 border-white rounded-full">
                                            +{Math.max(0, us.length - 9)}{" "}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-row mt-10  items-center">
                                    <div className="flex-1 font-bold text-[20px]">
                                        <h1>Start date:</h1>
                                        <h1 className="ml-10">
                                            {project.start_date}
                                        </h1>
                                    </div>
                                    <div className="flex-1 font-bold text-[20px]">
                                        <h1>End date:</h1>
                                        <h1 className="ml-10">
                                            {project.end_date}
                                        </h1>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col mt-10   items-center">
                                    <h1 className="text-blue-800  font-bold text-[35px]">
                                        Sprints
                                    </h1>
                                </div>
                                <div className="flex-1">
                                <div className="max-w-[1200px] flex overflow-x-auto">
                                        <div className="mb-4 flex overflow-x-auto">
                                            <div className="flex flex-1 gap-4">
                                                {sprints.map((sprint) => (
                                                    <div
                                                        key={sprint.id}
                                                        className={`flex flex-col items-start min-w-[150px]   p-4 border rounded-lg ${
                                                            sprint.status ===
                                                            "Completed"
                                                                ? "bg-green-200"
                                                                : sprint.status ===
                                                                  "Start"
                                                                ? "bg-blue-200"
                                                                : sprint.status ===
                                                                  "Pending"
                                                                ? "bg-yellow-200"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div>
                                                            <div>
                                                                name:{" "}
                                                                {sprint.name}
                                                            </div>
                                                            <div>
                                                                status:{" "}
                                                                {sprint.status}
                                                            </div>
                                                            <div>
                                                                date_debut:{" "}
                                                                {
                                                                    sprint.date_debut
                                                                }
                                                            </div>
                                                            <div>
                                                                date_fin:{" "}
                                                                {
                                                                    sprint.date_fin
                                                                }
                                                            </div>
                                                            <button
                                                                className="text-blue-500 mt-2 cursor-pointer"
                                                                onClick={() =>
                                                                    toggleDescription(
                                                                        sprint.id
                                                                    )
                                                                }
                                                            >
                                                                {showDescriptionId ===
                                                                sprint.id
                                                                    ? "Hide Description"
                                                                    : "Show Description"}
                                                            </button>
                                                            {showDescriptionId ===
                                                                sprint.id && (
                                                                <div className="max-h-32 overflow-y-auto">
                                                                    description:{" "}
                                                                    {
                                                                        sprint.description
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
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
