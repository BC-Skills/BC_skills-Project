/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axiosClient from "../../axios";

export default function Sprints({ project, onCloseModal }) {
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

    const status = [
        { id: "Start", name: "Start" },
        { id: "Pending", name: "Pending" },
        { id: "Completed", name: "Completed" },
    ];

    useEffect(() => {
        if (project) {
            fetchSprints();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project]);

    const Delete = async (sprintid) => {
        axiosClient
            .delete(`sprints/${sprintid}`)
            .then((response) => {
                if (response.status === 200 || response.status === 204) {
                    console.log("User deleted successfully!");
                    fetchSprints();
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
    };

    const [showSprintForm, setShowSprintForm] = useState(false);
    const handleAddSprint = () => {
        setShowSprintForm(true);
    };

    const handleCancelSprint = () => {
        setShowSprintForm(false);
    };

    const [selectedStatus, setSelectedStatus] = useState("");

    const handleStatusChange = (sprintId, newStatus) => {
        axiosClient
            .put(`sprints/${sprintId}`, { status: newStatus })
            .then((response) => {
                console.log("Sprint status updated:", response.data);
                fetchSprints();
            })
            .catch((error) => {
                console.error("Error updating sprint status:", error);
            });
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
                            <div className="flex  flex-col justify-between pb-3">
                                <div className="flex flex-row flex-1  justify-between">
                                    <h3 className="mb-4 text-[50px] font-medium text-gray-900 dark:text-blue-700">
                                        Sprints
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
                                {showSprintForm && (
                                    <form
                                        className="space-y-6"
                                        action="#"
                                        id="addSprintForm"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(
                                                e.target
                                            );
                                            const sprintData = {};
                                            formData.forEach((value, key) => {
                                                sprintData[key] = value;
                                            });

                                            sprintData.project_id = project.id;

                                            console.log(sprintData);
                                            axiosClient
                                                .post("sprints", sprintData)
                                                .then((response) => {
                                                    console.log(
                                                        "Sprint added:",
                                                        response.data
                                                    );
                                                    fetchSprints();
                                                    handleCancelSprint(); // Hide the sprint form after adding the sprint
                                                })
                                                .catch((error) => {
                                                    console.error(
                                                        "Error adding sprint:",
                                                        error
                                                    );
                                                });
                                        }}
                                    >
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                                Nom
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-white dark:text-white"
                                                placeholder="nom"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                                Sprint Status
                                            </label>
                                            <select
                                                name="status"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                required
                                            >
                                                {status.map((statu) => (
                                                    <option
                                                        key={statu.id}
                                                        value={statu.id}
                                                    >
                                                        {statu.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                                Start Date
                                            </label>
                                            <input
                                                type="date" // Use type 'date' for date input
                                                name="date_debut"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            />
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date" // Use type 'date' for date input
                                                    name="date_fin"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                                Sprint Description
                                            </label>
                                            <textarea
                                                name="description"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-white dark:text-white"
                                                placeholder="Sprint Description"
                                            />
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowSprintForm(false)
                                                }
                                                className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            >
                                                Add Sprint
                                            </button>
                                        </div>
                                    </form>
                                )}
                                {!showSprintForm && (
                                    <button
                                        type="button"
                                        onClick={handleAddSprint}
                                        className="w-full mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Add Sprints
                                    </button>
                                )}
                                <div className="grid grid-cols-1 mt-8  sm:grid-cols-2   lg:grid-cols-2 gap-4">
                                    {sprints.map((sprint) => (
                                        <div
                                            key={sprint.id}
                                            className={`rounded-lg p-4 shadow-md ${
                                                sprint.status === "Start"
                                                    ? "bg-purple-200"
                                                    : sprint.status ===
                                                      "Pending"
                                                    ? "bg-orange-200"
                                                    : "bg-green-200"
                                            }`}
                                        >
                                            <div className="font-bold  mb-2 text-[30px] flex items-center gap-3 justify-center">
                                                <span className="font-normal text-sm mt-2">
                                                    Name:
                                                </span>{" "}
                                                {sprint.name}
                                            </div>

                                            <div className="flex justify-between mt-2">
                                                <div>
                                                    <span className="font-bold">
                                                        Start date:
                                                    </span>{" "}
                                                    {sprint.date_debut}
                                                </div>
                                                <div>
                                                    <span className="font-bold">
                                                        End date:
                                                    </span>{" "}
                                                    {sprint.date_fin}
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <span className="font-bold">
                                                    Description:
                                                </span>{" "}
                                                {sprint.description}
                                            </div>
                                            <div className=" flex justify-between mt-5 gap-10 items-start">
                                                <select
                                                    name="status"
                                                    className="bg-gray-50 flex-1 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-600 dark:border-white-500 dark:placeholder-gray-400 dark:text-black"
                                                    value={sprint.status} // Use the sprint.status directly to display the selected status
                                                    onChange={(e) => {
                                                        const newStatus =
                                                            e.target.value;
                                                        setSelectedStatus(
                                                            (
                                                                prevSelectedStatus
                                                            ) => ({
                                                                ...prevSelectedStatus,
                                                                [sprint.id]:
                                                                    newStatus,
                                                            })
                                                        );
                                                        handleStatusChange(
                                                            sprint.id,
                                                            newStatus
                                                        );
                                                    }}
                                                    required
                                                >
                                                    {status.map((statu) => (
                                                        <option
                                                            key={statu.id}
                                                            value={statu.id}
                                                        >
                                                            {statu.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() =>
                                                        Delete(sprint.id)
                                                    }
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-8 h-8"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M14 5h-4m-4 0a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-4m-2 0V3h-4v2M3 9h18M12 12v4"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
