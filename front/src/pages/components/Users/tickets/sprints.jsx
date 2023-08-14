import { useState, useEffect } from "react";
import axiosClient from "../../../../axios";

// eslint-disable-next-line react/prop-types
export default function Sprints({ projectid }) {
    const [sprints, setSprints] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSprints, setFilteredSprints] = useState([]); // Add this line
      const fetchSprints = async () => {
            try {
                const response = await axiosClient.get(`sprintss/${projectid}`);
                const sprintsData = response.data;
                setSprints(sprintsData);
            } catch (error) {
                console.error("Error fetching sprints:", error);
            }
        };

    useEffect(() => {
      

        if (projectid) {
            fetchSprints();
        }
    }, [projectid]);

    useEffect(() => {
        const updatedFilteredSprints = sprints.filter(
            (sprint) =>
                sprint.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (selectedStatus === "" || sprint.status === selectedStatus)
        );
        setFilteredSprints(updatedFilteredSprints);
    }, [sprints, searchQuery, selectedStatus]);

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

    const status = [
        { id: "Start", name: "Start" },
        { id: "Pending", name: "Pending" },
        { id: "Completed", name: "Completed" },
    ];

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="additional-content flex-1 flex flex-col p-5 rounded-2xl shadow-xl">
            <div className="flex flex-row  justify-between gap-10">
                <div className="mt-5 mb-2 border-2 py-1 px-3 flex justify-between flex-1  rounded-md hover:border-blue-500">
                    <input
                        id="searchInput"
                        className="flex-grow outline-none text-gray-600 focus:text-blue-600"
                        type="text"
                        placeholder="Search Sprint..."
                        value={searchQuery}
                        onChange={handleSearchChange}
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
                <select
                    id="searchStatus"
                    className="bg-gray-50 border mt-5 mb-2 border-2 py-1 px-3 border-gray-300 flex-1 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-white-600 dark:border-white-500 dark:placeholder-gray-400 dark:text-black"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    {status.map((statu) => (
                        <option key={statu.id} value={statu.id}>
                            {statu.name}
                        </option>
                    ))}
                </select>
            </div>
            <div
                className="grid grid-cols-1 mt-8 sm:grid-cols-2 lg:grid-cols-2 gap-4 overflow-y-auto"
                style={{ maxHeight: "800px" }}
            >
                {filteredSprints.map((sprint) => (
                    <div
                        key={sprint.id}
                        className={`rounded-lg p-4 shadow-md ${
                            sprint.status === "Start"
                                ? "bg-purple-200"
                                : sprint.status === "Pending"
                                ? "bg-orange-200"
                                : "bg-green-200"
                        }`}
                    >
                        <div className="font-bold  mb-2 text-[30px] flex items-center gap-3 justify-center">
                            <span className="font-normal text-sm mt-2">
                                Name:
                            </span>
                            {sprint.name}
                        </div>

                        <div className="flex justify-between mt-2">
                            <div>
                                <span className="font-bold">Start date:</span>
                                {sprint.date_debut}
                            </div>
                            <div>
                                <span className="font-bold">End date:</span>
                                {sprint.date_fin}
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="font-bold">Description:</span>{" "}
                            {sprint.description}
                        </div>
                        <div className=" flex justify-between mt-5 gap-10 items-start">
                            <select
                                name="status"
                                className="bg-gray-50 flex-1 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-600 dark:border-white-500 dark:placeholder-gray-400 dark:text-black"
                                value={sprint.status} // Use the sprint.status directly to display the selected status
                                onChange={(e) => {
                                    const newStatus = e.target.value;
                                    handleStatusChange(sprint.id, newStatus);
                                }}
                                required
                            >
                                {status.map((statu) => (
                                    <option key={statu.id} value={statu.id}>
                                        {statu.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
