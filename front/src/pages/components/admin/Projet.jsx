import { useState, useEffect, useRef } from "react";
import axiosClient from "../../../axios";
import '../../../assets/css/Switch.css'

export default function Projet() {
    const [projects, setProjects] = useState([]);
    const [headerLoading, setHeaderLoading] = useState(true); // Add loading state for table header

    function getStatusColorClass(status) {
        switch (status) {
            case "progress":
                return "text-black-400 bg-green-400 dark:bg-white-800";
            case "pending":
                return "text-black-500 bg-yellow-100 dark:bg-white-800";
            case "finished":
                return "text-black-500 bg-blue-100 dark:bg-white-800";
            default:
                return "text-black-500 bg-emerald-400 dark:bg-white-800";
        }
    }

    function getStatusText(status) {
        return status;
    }

    const fetchProjects = async () => {
        try {
            const response = await axiosClient.get("projects");
            const projectsData = response.data;

            const updatedProjects = await Promise.all(
                projectsData.map(async (project) => {
                    const clientResponse = await axiosClient.get(
                        `users/${project.client_id}`
                    );
                    const projectManagerResponse = await axiosClient.get(
                        `users/${project.project_manager_id}`
                    );

                    const client = clientResponse.data;
                    const projectManager = projectManagerResponse.data;

                    return { ...project, client, projectManager };
                })
            );

            setProjects(updatedProjects);
            setHeaderLoading(false);
        } catch (error) {
            console.error("Error fetching projects:", error);
            setHeaderLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

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
        const employeeTable = document.getElementById("Project");
        const tableRows = employeeTable.getElementsByTagName("tr");
        handleSearchChange(searchText, tableRows);
    };

    const searchInputRef = useRef(null);

    useEffect(() => {
        const searchInput = searchInputRef.current;
        if (searchInput) {
            searchInput.addEventListener("input", handleSearch);
        }
        return () => {
            if (searchInput) {
                searchInput.removeEventListener("input", handleSearch);
            }
        };
    }, []);

    return (
        <div className="flex-1 p-2   gap-10 flex-row justify-between flex-wrap">
            <div className=" ml-[2%] mr-[2%] pl-32 mt-32 pr-32 flex justify-between items-center  rounded-xl">
                <div className="flex-1 flex-col flex justify-center items-start">
                    <div className="h-1  rounded-full w-[280px] bg-black" />
                    <h1 className="text-[50px] font-semibold text-slate-500">
                        Project List
                    </h1>
                    <div className="h-1 rounded-full w-[280px] bg-black" />
                </div>
                <div className="mt-2  mb-2 border-2 py-1 px-3 flex justify-between  rounded-md hover:border-blue-500">
                    <input
                        ref={searchInputRef}
                        id="searchInput"
                        className="flex-grow outline-none text-gray-600 focus:text-blue-600"
                        type="text"
                        placeholder="Search Employee..."
                    />
                    <spa>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-400 focus:text-blue-400 transition duration-100 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </spa>
                </div>
            </div>
            <div className="bg-gray-4 gap-10 p-10  rounded-xl flex-1 drop-shadow-xl shadow-gray-300">
            {headerLoading ? (
                                        // Display loading for table header while projects are being fetched
                                        <div className="flex-1 flex justify-center items-center">
                                            <div className=" w-16 h-16 border-4 border-t-transparent border-red-400 border-double rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                <section className="container px-4 mx-auto rounded-xl overflow-hidden drop-shadow-xl shadow-gray-300">
                    <div className="flex flex-col">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                                  
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                                         id="Project"
                                         >
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                                    >
                                                        <div className="flex items-center gap-x-3">
                                                            <button className="flex items-center gap-x-2">
                                                                <span>ID</span>
                                                                <svg
                                                                    className="h-3"
                                                                    viewBox="0 0 10 11"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    {/* ... (SVG path for the sort icon) ... */}
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                                    >
                                                        Nom
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                                    >
                                                        Status
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                                    >
                                                        Customer
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                                    >
                                                        Manager
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody
                                                id="project-table-body"
                                                className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
                                            >
                                                {projects.map((project) => (
                                                    <tr key={project.id}>
                                                        <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                                            <div className="inline-flex items-center gap-x-3">
                                                                <span className="text-white">
                                                                    #
                                                                    {project.id}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-white whitespace-nowrap">
                                                            {project.nom}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                            <div
                                                                className={`inline-flex  items-center px-3 py-1 rounded-full gap-x-2 ${getStatusColorClass(
                                                                    project.status
                                                                )}`}
                                                            >
                                                                <svg
                                                                    width="12"
                                                                    height="12"
                                                                    viewBox="0 0 12 12"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M10 3L4.5 8.5L2 6"
                                                                        stroke="currentColor"
                                                                    />
                                                                </svg>
                                                                <h2 className="text-sm font-normal">
                                                                    {getStatusText(
                                                                        project.status
                                                                    )}
                                                                </h2>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                                            id={`profile-${project.id}`}
                                                        >
                                                            <div className="flex items-center gap-x-2">
                                                                <img
                                                                    className="object-cover w-8 h-8 rounded-full"
                                                                    src={
                                                                        project
                                                                            .client
                                                                            ?.profile_picture
                                                                    }
                                                                    alt=""
                                                                />
                                                                <div>
                                                                    <h2 className="text-sm font-medium text-gray-800 dark:text-white">
                                                                        {
                                                                            project
                                                                                .client
                                                                                ?.name
                                                                        }
                                                                    </h2>
                                                                    <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                                                                        {
                                                                            project
                                                                                .client
                                                                                ?.email
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                                            id={`employe-${project.id}`}
                                                        >
                                                            <div className="flex items-center gap-x-2">
                                                                <img
                                                                    className="object-cover w-8 h-8 rounded-full"
                                                                    src={
                                                                        project
                                                                            .projectManager
                                                                            ?.profile_picture
                                                                    }
                                                                    alt=""
                                                                />
                                                                <div>
                                                                    <h2 className="text-sm font-medium text-gray-800 dark:text-white">
                                                                        {
                                                                            project
                                                                                .projectManager
                                                                                ?.name
                                                                        }
                                                                    </h2>
                                                                    <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                                                                        {
                                                                            project
                                                                                .projectManager
                                                                                ?.email
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                )}
            </div>
        </div>
    );
}
