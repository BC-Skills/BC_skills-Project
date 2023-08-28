import { useEffect, useRef, useState } from "react";
import project from "../../../assets/images/logo/code.png";
import presentation from "../../../assets/images/logo/presentation.png";
import axiosClient from "../../../axios";
import Chart from "chart.js/auto"; // Import Chart.js

export default function Statistique() {
    const [statistics, setStatistics] = useState({
        client_count: 0,
        project_count: 0,
        completed_project_count: 0,
        started_project_count: 0,
        pending_project_count: 0,
        formation_count: 0,
        user_count: 0,
    });
    const [selectedChartType, setSelectedChartType] = useState("bar"); // Default to bar chart
    const [topTicketFinishers, setTopTicketFinishers] = useState([]);
    const [topprojectmanagers, settopprojectmanagers] = useState([]);


   
    useEffect(() => {
        axiosClient
            .get("dashboard")
            .then((response) => {
                setStatistics(response.data);
                setTopTicketFinishers(response.data.top_ticket_finishers);
                settopprojectmanagers(response.data.top_project_managers);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        fetchProjects();
    }, []);

    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = document.getElementById("myChart").getContext("2d");
        const newChart = new Chart(ctx, {
            type: selectedChartType,
            data: {
                labels: ["Started", "Pending", "Completed"],
                datasets: [
                    {
                        label: "Project Status",
                        data: [
                            statistics.started_project_count,
                            statistics.pending_project_count,
                            statistics.completed_project_count,
                        ],
                        backgroundColor: ["green", "orange", "red"],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
        chartRef.current = newChart;
    }, [statistics, selectedChartType]);

    const [selectedGraphOption, setSelectedGraphOption] = useState("project");
    const [selectedSprintOption, setSelectedSprintOption] = useState("all");

    const [projects, setProjects] = useState([]);
    const [projectSprints, setProjectSprints] = useState([]);

    const fetchProjects = async () => {
        try {
            const response = await axiosClient.get("/dashboard/projects");
            setProjects(response.data.projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };
    const fetchProjectssptins = async () => {
        try {
            axiosClient
                .get(`/dashboard/projects/${selectedGraphOption}/sprints`)
                .then((response) => {
                    setProjectSprints(response.data.sprints);
                })
                .catch((error) => {
                    console.error("Error fetching sprints:", error);
                });
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        if (selectedGraphOption !== "project") {
            console.log(selectedGraphOption);
            fetchProjectssptins(selectedGraphOption);
        } else {
            setProjectSprints(null);
        }
    }, [selectedGraphOption]);

    const [selectedProjectSprintCounts, setSelectedProjectSprintCounts] =
        useState({
            pending_sprint_count: 0,
            started_sprint_count: 0,
            completed_sprint_count: 0,
        });

    useEffect(() => {
        if (selectedGraphOption !== "project") {
            axiosClient
                .get(`/dashboard/projects/${selectedGraphOption}/sprint-status`)
                .then((response) => {
                    setSelectedProjectSprintCounts(response.data);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching sprint status counts:",
                        error
                    );
                });
        }
    }, [selectedGraphOption]);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = document.getElementById("myChart").getContext("2d");
        const newChart = new Chart(ctx, {
            type: selectedChartType,
            data: {
                labels: ["Started", "Pending", "Completed"],
                datasets: [
                    {
                        label: "Sprint Status",
                        data: [
                            selectedProjectSprintCounts.started_sprint_count,
                            selectedProjectSprintCounts.pending_sprint_count,
                            selectedProjectSprintCounts.completed_sprint_count,
                        ],
                        backgroundColor: ["red", "orange", "green"],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
        chartRef.current = newChart;
    }, [selectedProjectSprintCounts, selectedChartType]);

    const [selectedSprintTicketCounts, setSelectedSprintTicketCounts] =
        useState({
            pending_ticket_count: 0,
            started_ticket_count: 0,
            completed_ticket_count: 0,
        });

    useEffect(() => {
        if (selectedSprintOption !== "all") {
            axiosClient
                .get(
                    `/dashboard/projects/${selectedGraphOption}/sprints/${selectedSprintOption}/ticket-status`
                )
                .then((response) => {
                    setSelectedSprintTicketCounts(response.data);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching sprint ticket status counts:",
                        error
                    );
                });
        }
    }, [selectedSprintOption]);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = document.getElementById("myChart").getContext("2d");
        const newChart = new Chart(ctx, {
            type: selectedChartType, // Use the selected chart type
            data: {
                labels: ["Started", "Pending", "Completed"],
                datasets: [
                    {
                        label: "Sprint Ticket Status",
                        data: [
                            selectedSprintTicketCounts.started_ticket_count,
                            selectedSprintTicketCounts.pending_ticket_count,
                            selectedSprintTicketCounts.completed_ticket_count,
                        ],
                        backgroundColor: ["red", "orange", "green"],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
        chartRef.current = newChart;
    }, [selectedSprintTicketCounts, selectedChartType]);

    return (
        <div className="flex-1  flex flex-col mt-6">
            <div className="flex-[0.3] flex flex-row px-4 py-4 flex-wrap gap-4">
                <div className="flex-1 rounded-2xl flex justify-around items-center shadow-xl shadow-gray-300 bg-gradient-to-r from-purple-50 to-purple-200">
                    <div className="flex-1 flex justify-around">
                        <div>
                            <h3 className="text-3xl leading-tight text-gray-500 dark:text-slate-400">
                                Clients
                            </h3>
                            <h1 className="text-5xl leading-tight font-semibold">
                                <div>{statistics.client_count}</div>
                            </h1>
                        </div>
                    </div>
                    <span className="flex-1 inline-flex justify-center items-center  h-16 text-emerald-500">
                        <svg
                            viewBox="0 0 24 24"
                            width="88"
                            height="88"
                            className="inline-block"
                        >
                            <path
                                fill="currentColor"
                                d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z"
                            ></path>
                        </svg>
                    </span>
                </div>
                <div className="flex-1 rounded-2xl flex justify-around items-center shadow-xl shadow-gray-300 bg-gradient-to-r from-orange-50 to-orange-200">
                    <div className="flex-1 flex justify-around">
                        <div>
                            <h3 className="text-3xl leading-tight text-gray-500 dark:text-slate-400">
                                Projects
                            </h3>
                            <h1 className="text-5xl leading-tight font-semibold">
                                <div>{statistics.project_count}</div>
                            </h1>
                        </div>
                    </div>
                    <span className="flex-1 inline-flex justify-center items-center  h-16 text-emerald-500">
                        <img src={project} width="88" height="88" alt="" />
                    </span>
                </div>
                <div className="flex-1 rounded-2xl flex justify-around items-center shadow-xl shadow-gray-300 bg-gradient-to-r from-blue-50 to-blue-200">
                    <div className="flex-1 flex justify-around">
                        <div>
                            <h3 className="text-3xl leading-tight text-gray-500 dark:text-slate-400">
                                Employes
                            </h3>
                            <h1 className="text-5xl leading-tight font-semibold">
                                <div>{statistics.user_count}</div>
                            </h1>
                        </div>
                    </div>
                    <span className="flex-1 inline-flex justify-center items-center  h-16 text-red-400">
                        <svg
                            viewBox="0 0 24 24"
                            width="88"
                            height="88"
                            className="inline-block"
                        >
                            <path
                                fill="currentColor"
                                d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z"
                            ></path>
                        </svg>
                    </span>
                </div>
                <div className="flex-1 rounded-2xl flex justify-around items-center shadow-xl shadow-gray-300 bg-gradient-to-r from-green-50 to-green-200">
                    <div className="flex-1 flex justify-around">
                        <div>
                            <h3 className="text-3xl leading-tight text-gray-500 dark:text-slate-400">
                                Formation
                            </h3>
                            <h1 className="text-5xl leading-tight font-semibold">
                                <div>{statistics.formation_count}</div>
                            </h1>
                        </div>
                    </div>
                    <span className="flex-1 inline-flex justify-center items-center  h-16 text-emerald-500">
                        <img src={presentation} width="88" height="88" alt="" />
                    </span>
                </div>
            </div>
            <div className="flex-1 flex flex-row px-4 py-4 sm:flex-col flex-wrap gap-4 ">
                <div className="flex-1 flex flex-col pt-10 rounded-2xl justify-around bg-gradient-to-r  from-gray-50 to-gray-100  shadow-xl shadow-gray-300">
                    <canvas id="myChart" width="400" height="200"></canvas>
                    <div className=" flex flex-row px-4 py-4 flex-wrap gap-4">
                        <div className="flex-1 rounded-2xl shadow-xl bg-gradient-to-r from-indigo-50 to-indigo-200">
                            <select
                                className="w-full h-[60px] text-center rounded-2xl bg-gradient-to-r from-indigo-50 to-indigo-200"
                                value={selectedChartType}
                                onChange={(e) =>
                                    setSelectedChartType(e.target.value)
                                }
                            >
                                <option value="bar">Bar Chart</option>
                                <option value="line">Line Chart</option>
                                <option value="pie">Pie Chart</option>
                                <option value="doughnut">Doughnut Chart</option>
                                <option value="polarArea">
                                    Polar Area Chart
                                </option>
                                <option value="radar">Radar Chart</option>
                                <option value="bubble">Bubble Chart</option>
                                <option value="scatter">Scatter Chart</option>
                            </select>
                        </div>
                        <div className="flex-1 rounded-2xl shadow-xl  bg-slate-500 shadow-gray-300">
                            <select
                                className="w-full  h-[60px] text-center rounded-2xl bg-gradient-to-r from-purple-50 to-purple-200"
                                value={selectedGraphOption}
                                onChange={(e) =>
                                    setSelectedGraphOption(e.target.value)
                                }
                            >
                                <option value="">Projects</option>
                                {projects?.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 rounded-2xl shadow-xl  shadow-gray-300">
                            <select
                                className="w-full h-[60px] text-center rounded-2xl bg-gradient-to-r from-green-50 to-green-200"
                                value={selectedSprintOption}
                                onChange={(e) =>
                                    setSelectedSprintOption(e.target.value)
                                }
                            >
                                <option value="all">All Sprints</option>
                                {projectSprints?.map((sprint) => (
                                    <option key={sprint.id} value={sprint.id}>
                                        {sprint.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col px-4 py-4 flex-wrap gap-4 ">
                    <div className="flex-1 rounded-2xl shadow-xl shadow-gray-300">
                        <div className="flex-1  shadow-gray-300">
                            <h3 className="text-3xl font-semibold m-4 text-center text-purple-600">
                                Top Ticket Finishers
                            </h3>
                            {topTicketFinishers.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-white p-3 rounded-xl shadow-xl flex items-center justify-between mt-2"
                                >
                                    <div className="flex space-x-6 items-center">
                                        <img
                                            src={user.profile_picture}
                                            className="w-auto h-24 rounded-lg"
                                        />
                                        <div>
                                            <p className="font-semibold text-base">
                                                {user.name}
                                            </p>
                                            <p className="font-semibold text-sm text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        <div className="bg-red-300 rounded-md p-5 justify-around gap-3 flex items-center text-2xl">
                                        <ion-icon name="ticket-outline"></ion-icon>
                                            {user.finished_ticket_count ?? 0}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 rounded-2xl shadow-xl shadow-gray-300">
                    <div className="flex-1  shadow-gray-300">
                            <h3 className="text-3xl font-semibold m-4 text-center text-purple-600">
                                Top Projects Finishers
                            </h3>
                            {topprojectmanagers.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-white p-3 rounded-xl shadow-xl flex items-center justify-between mt-2"
                                >
                                    <div className="flex space-x-6 items-center">
                                        <img
                                            src={user.profile_picture}
                                            className="w-auto h-24 rounded-lg"
                                        />
                                        <div>
                                            <p className="font-semibold text-base">
                                                {user.name}
                                            </p>
                                            <p className="font-semibold text-sm text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        <div className="bg-red-300 rounded-md p-5 justify-around gap-3 flex items-center text-2xl">
                                        <ion-icon name="code-outline"></ion-icon>
                                            {user.project_count ?? 0}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
