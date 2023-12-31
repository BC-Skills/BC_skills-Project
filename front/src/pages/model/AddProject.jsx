/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/contextProvider";

export default function AddProject({ onCloseModal, fetchUsersData }) {
    // const [profiles, setProfiles] = useState([]);

    const [step, setStep] = useState(1); // Set initial step to 1
    const [step1Data, setStep1Data] = useState({});
    // const [step2Data, setStep2Data] = useState({});
    const [proje, setProjet] = useState({});
    // const [step4Data, setStep4Data] = useState({});

    const [projectTypes, setProjectTypes] = useState([]);

    useEffect(() => {
        const fetchProjectTypes = async () => {
            try {
                const response = await axiosClient.get("project-types");
                const projectTypesData = response.data;
                setProjectTypes(projectTypesData);
            } catch (error) {
                console.error("Error fetching project types:", error);
            }
        };
        fetchProjectTypes();
    }, []);

    const handleNextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const status = [
        { id: "Start", name: "Start" },
        { id: "Pending", name: "Pending" }, 
        { id: "Completed", name: "Completed" },
    ];

    // Create state variables to store the fetched users
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch all users
        const fetchUsers = async () => {
            try {
                const response = await axiosClient.get("userss/clients");
                const users = response.data;
                setUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmitStep1 = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Convert numeric fields to integers if needed
        data.duree = parseInt(data.duree, 10);

        setStep1Data(data);
        handleNextStep();
    };
    const { currentUser } = useStateContext();

    const handleSubmitStep2 = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        data.client_id = parseInt(data.client_id, 10);
        data.project_manager_id = currentUser.id;

        const combinedData = {
            ...step1Data,
            ...data,
        };
        axiosClient
            .post("projects", combinedData)
            .then((response) => {
                setProjet(response.data);
                handleNextStep();
            })
            .catch((error) => {
                console.error("Error adding project:", error);
                // Display an error message to the user or take other appropriate actions
            });
    };

    const [showSprintForm, setShowSprintForm] = useState(false);
    const handleAddSprint = () => {
        setShowSprintForm(true);
    };

    const handleCancelSprint = () => {
        setShowSprintForm(false);
    };

    const [sprints, setSprints] = useState([]);

    const fetchSprints = async () => {
        try {
            const response = await axiosClient.get(`sprintss/${proje.id}`);
            const sprintsData = response.data;
            setSprints(sprintsData);
        } catch (error) {
            console.error("Error fetching sprints:", error);
        }
    };

    // Update the useEffect to fetch sprints when proje.id changes
    useEffect(() => {
        if (proje) {
            fetchSprints();
        }
    }, [proje]);

    const totalSteps = 3; // Total number of steps in the process
    const progress = ((step - 1) / (totalSteps - 1)) * 100; // Calculate progress as a percentage
    

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
                className="fixed ml-[25%] z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div className="relative w-full max-w-xl max-h-full shadow-2xl">
                    <div className="relative bg-white rounded-lg shadow dark:bg-white">
                        <div className="px-6 py-6 lg:px-8">
                            <div className="flex items-center justify-between pb-3">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                                    Add Project
                                </h3>

                                <button
                                    type="button"
                                    onClick={onCloseModal}
                                    data-modal-hide="edit-user-modal"
                                    className="text-black hover:text-gray-900 focus:outline-none"
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
                            <div className="flex-1 pt-1">
                                <div className="flex mb-2  items-center justify-between">
                                    <div>
                                        <span className="text-[25px]  font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                            Step {step} of {totalSteps}
                                        </span>
                                    </div>
                                    <div className="text-right ">
                                        <span className="text-[25px] font-semibold inline-block text-blue-600">
                                            {progress.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-5 mb-4 text-xs flex rounded bg-blue-200">
                                    <div
                                        style={{ width: `${progress}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                                    ></div>
                                </div>
                            </div>
                            {step === 1 && (
                                <form
                                    className="space-y-6"
                                    action="#"
                                    id="addEmployeeForm"
                                    onSubmit={handleSubmitStep1}
                                >
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            name="nom"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-white dark:text-white"
                                            placeholder="nom"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="project_type_id"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                                        >
                                            Type de projet
                                        </label>
                                        <select
                                            name="project_type_id"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        >
                                            <option value="">
                                                Select Project Type
                                            </option>
                                            {projectTypes.map((type) => (
                                                <option
                                                    key={type.id}
                                                    value={type.id}
                                                >
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                            Duree
                                        </label>
                                        <input
                                            min={0}
                                            type="number"
                                            name="duree"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-white dark:text-white"
                                            placeholder="Duree"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-white dark:text-white"
                                            placeholder="description"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                            Date Debut
                                        </label>
                                        <input
                                            type="date" // Use type 'date' for date input
                                            name="start_date"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        />
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                                Date Fin
                                            </label>
                                            <input
                                                type="date" // Use type 'date' for date input
                                                name="end_date"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="button"
                                            onClick={onCloseModal}
                                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                </form>
                            )}
                            {step === 2 && (
                                <form
                                    className="space-y-6"
                                    action="#"
                                    id="addEmployeeForm"
                                    onSubmit={handleSubmitStep2}
                                >
                                    <div>
                                        <label
                                            htmlFor="client_id"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                                        >
                                            Client
                                        </label>
                                        <select
                                            name="client_id"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        >
                                            <option value="">
                                                Choisir Client
                                            </option>
                                            {users.map((client) => (
                                                <option
                                                    key={client.id}
                                                    value={client.id}
                                                >
                                                    {client.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="profil"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                                        >
                                            Status
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
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="button"
                                            onClick={handlePreviousStep}
                                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Precedent
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                </form>
                            )}
                            {step === 3 && (
                                <>
                                    <div className="max-w-[600px] flex overflow-x-auto">
                                        <div className="mb-4 flex overflow-x-auto">
                                            <div className="flex flex-1 gap-4">
                                                {sprints.map((sprint) => (
                                                    <div
                                                        key={sprint.id}
                                                        className={`flex flex-row items-start min-w-[150px]  overflow-auto   p-4 border rounded-lg ${
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
                                                formData.forEach(
                                                    (value, key) => {
                                                        sprintData[key] = value;
                                                    }
                                                );

                                                sprintData.project_id =
                                                    proje.id;

                                                console.log(sprintData);
                                                axiosClient
                                                    .post("sprints", sprintData)
                                                    .then((response) => {
                                                        console.log(
                                                            "Sprint added:",
                                                            response.data
                                                        );
                                                        fetchUsersData();
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
                                                    Phase status
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
                                                    Date Debut
                                                </label>
                                                <input
                                                    type="date" // Use type 'date' for date input
                                                    name="date_debut"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                />
                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                                        Date Fin
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
                                                    Phase Description
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
                                                    Annuler
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    Ajouter une phase
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
                                            Ajouter une phase
                                        </button>
                                    )}

                                    <div className="flex justify-end pt-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={handlePreviousStep}
                                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Precedent
                                        </button>
                                        <button
                                            onClick={() => {
                                                fetchUsersData();
                                                window.location.reload();
                                                sessionStorage.removeItem(
                                                    "projectsData"
                                                );
                                                fetchUsersData();
                                            }}
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
