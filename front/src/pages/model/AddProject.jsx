/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axiosClient from "../../axios";

export default function AddProject({ onCloseModal, fetchUsersData }) {
    // const [profiles, setProfiles] = useState([]);

    const [step, setStep] = useState(1); // Set initial step to 1

    const handleNextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const status = [
        { id: "Completed", name: "Completed" },
        { id: "Start", name: "Start" },
        { id: "Pending", name: "Pending" },
    ];

    // Create state variables to store the fetched users
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch all users
        const fetchUsers = async () => {
            try {
                const response = await axiosClient.get("users");
                const users = response.data;
                // Here, users will contain an array of all users
                setUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = (event) => {
        // ... (Remaining handleSubmit logic)
        event.preventDefault(); // Prevent form default submission

        const formData = new FormData(event.target);
        const payload = {};
        formData.forEach((value, key) => {
            payload[key] = value;
        });

        axiosClient
            .post("projects", payload) // POST to "projects" instead of "users"
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
                window.location.reload();
                sessionStorage.removeItem("projectsData"); // Remove "roles" from session storage
                fetchUsersData();
            })
            .catch((error) => {
                console.error("Error adding project:", error);
            });
    };
    // const formArray = ['1', '2', '3'];
    const [showSprintForm, setShowSprintForm] = useState(false);

    // Step 4: Define a function to handle showing the sprint form and hiding the "Add Sprints" button
    const handleAddSprint = () => {
      // Here, you can perform any logic before showing the SprintForm
      setShowSprintForm(true);
    };
  
    // Step 5: Define a function to handle hiding the sprint form and showing the "Add Sprints" button
    const handleCancelSprint = () => {
      setShowSprintForm(false);
    };

    const [sprints, setSprints] = useState([]); // Initialize sprints state as an empty array


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
                                    Add Employee
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

                            {step === 1 && (
                                <form
                                    className="space-y-6"
                                    action="#"
                                    id="addEmployeeForm"
                                    onSubmit={handleSubmit}
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
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                            Duree
                                        </label>
                                        <input
                                            type="text"
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
                                            Start Date
                                        </label>
                                        <input
                                            type="date" // Use type 'date' for date input
                                            name="start_date"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        />
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                                End Date
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
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 2 && (
                                <form
                                    className="space-y-6"
                                    action="#"
                                    id="addEmployeeForm"
                                    onSubmit={handleSubmit}
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
                                                Select Client
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
                                            htmlFor="project_manager_id"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                                        >
                                            Project Manager
                                        </label>
                                        <select
                                            name="project_manager_id"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        >
                                            <option value="">
                                                Select Project Manager
                                            </option>
                                            {users.map((manager) => (
                                                <option
                                                    key={manager.id}
                                                    value={manager.id}
                                                >
                                                    {manager.name}
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
                                            Previous
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <>
                                {!showSprintForm && (
                                            <div>
                                                {/* Display the list of sprints in the desired order */}
                                                {sprints.map((sprint) => (
                                                <div key={sprint.id}>
                                                    {/* Display sprint information here */}
                                                    <p>{sprint.sprintName}</p>
                                                    
                                                </div>
                                                ))}
                                            </div>
                                            )}
                                    {showSprintForm && (
                                        <form
                                            className="space-y-6"
                                            action="#"
                                            id="addSprintForm"
                                            onSubmit={(e) => {
                                                e.preventDefault();

                                                // Here, you can add the logic to send the sprint data to the server
                                                // For example, you can use axiosClient.post() to make a POST request to add the sprint to the database

                                                const formData = new FormData(
                                                    e.target
                                                );
                                                const sprintData = {};
                                                formData.forEach(
                                                    (value, key) => {
                                                        sprintData[key] = value;
                                                    }
                                                );

                                                axiosClient
                                                    .post("sprints", sprintData)
                                                    .then((response) => {
                                                        // Sprint added successfully, you can perform any actions needed
                                                        // For example, show a success message or fetch updated data
                                                        console.log(
                                                            "Sprint added:",
                                                            response.data
                                                        );
                                                        fetchUsersData();
                                                        setShowSprintForm(
                                                            false
                                                        ); // Hide the sprint form after adding the sprint
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
                                                    Sprint Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="sprintName"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-white dark:text-white"
                                                    placeholder="Sprint Name"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                                    Sprint Duration
                                                </label>
                                                <input
                                                    type="text"
                                                    name="sprintDuration"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-white dark:text-white"
                                                    placeholder="Sprint Duration"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                                    Sprint Description
                                                </label>
                                                <textarea
                                                    name="sprintDescription"
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


                                    <div className="flex justify-end pt-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={handlePreviousStep}
                                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            ADD
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
