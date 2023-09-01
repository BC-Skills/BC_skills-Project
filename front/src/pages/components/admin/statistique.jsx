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
                labels: ["A faire", "En Cours", "Fini"],
                datasets: [
                    {
                        label: "L'état du projet",
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
                labels: ["A faire", "En Cours", "Fini"],
                datasets: [
                    {
                        label: "L'état du phase",
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
                labels: ["A faire", "En Cours", "Fini"],
                datasets: [
                    {
                        label: "L'état du Tache",
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
        <div className="flex-1  flex flex-col mt-6 bg-gray-50">
            <div className="flex-[0.2] flex flex-row px-4 py-4 flex-wrap gap-4">
                <div className="relative flex-1 flex justify-end items-end p-8 ">
                    <div className="flex-1 flex justify-end items-end shadow-2xl bg-white p-12  rounded-lg shadow-[#f3c17ba0]">
                        <div>
                            <h3 className="mb-2 font-sans font-semibold leading-normal text-2xl">
                                Clients
                            </h3>
                            <h1 className="mb-0 font-bold text-2xl">
                                <div className="mb-0 font-bold text-[40px]">{statistics.client_count}</div>
                            </h1>
                        </div>
                    </div>
                    <span className="absolute top-0 left-12 p-4 rounded-2xl bg-[#FF9300] shadow-xl shadow-[#f3c17b55] " style={{ color: 'white' }}>
                <lord-icon
                    src="https://cdn.lordicon.com/hbvyhtse.json"
                    trigger="loop"
                    delay="2000"
                    colors="primary:#ffffff"
                    style={{width:`300px;height:300px;`}}>
                </lord-icon>
                    </span>
                </div>
                <div className="relative flex-1 flex justify-end items-end p-8">
                    <div className="flex-1 flex justify-end items-end shadow-xl bg-white p-12   rounded-lg    shadow-[#d5e4f0] ">
                        <div>
                            <h3 className="mb-2 font-sans font-semibold leading-normal text-2xl">
                                Projets
                            </h3>
                            <h1 className="mb-0 font-bold text-2xl">
                                <div className="mb-0 font-bold text-[40px]">{statistics.project_count}</div>
                            </h1>
                        </div>
                    </div>
                    <span className=" absolute top-0 left-12 p-4 rounded-2xl bg-[#068FF1] shadow-lg   shadow-[#82c6f7] " style={{ color: 'white' }}>
                    <lord-icon
                        src="https://cdn.lordicon.com/zlyxhzar.json"
                        trigger="loop"
                        colors="primary:#ffffff"
                        style={{width:`250px;height:250px;`}}>
                    </lord-icon>
                    </span>
                </div>
                <div className="relative flex-1 flex justify-end items-end p-8">
                    <div className="flex-1 flex justify-end items-end  bg-white p-12   rounded-lg shadow-xl   shadow-[#e0cff3]">
                        <div>
                            <h3 className="mb-2 font-sans font-semibold leading-normal text-2xl">
                                Employés
                            </h3>
                            <h1 className="mb-0 font-bold text-2xl">
                                <div className="mb-0 font-bold text-[40px]">{statistics.user_count}</div>
                            </h1>
                        </div>
                    </div>
                    <span className=" absolute top-0 left-12 p-4 rounded-2xl bg-[#983FFB] shadow-xl   shadow-[#dcc6f3]" style={{ color: 'white' }}>
                    <lord-icon
                        src="https://cdn.lordicon.com/hbvyhtse.json"
                        trigger="loop"
                        delay="2000"
                        colors="primary:#ffffff"
                        style={{width:`300px;height:300px;`}}>
                    </lord-icon>
                    </span>
                </div>
                <div className="relative flex-1 flex justify-end items-end p-8">
                    <div className="flex-1 flex justify-end items-end  bg-white p-12   rounded-lg shadow-xl   shadow-[#d9ebd9]">
                        <div>
                            <h3 className="mb-2 font-sans font-semibold leading-normal text-2xl">
                                Formation
                            </h3>
                            <h1 className="mb-0 font-bold text-2xl">
                                <div className="mb-0 font-bold text-[40px]">{statistics.client_count}</div>
                            </h1>
                        </div>
                    </div>
                    <span className=" absolute top-0 left-12 p-4 rounded-2xl bg-[#05EB07] shadow-xl   shadow-[#b9f0ba]" style={{ color: 'white' }}>
                    <lord-icon
                        src="https://cdn.lordicon.com/qvbrkejx.json"
                        trigger="loop"
                        delay="1000"
                        colors="primary:#ffffff"
                        style={{width:`300px;height:300px;`}}>
                    </lord-icon>
                    </span>
                </div>
            </div>
            <div className="flex-1 flex flex-row px-4 py-4 sm:flex-col flex-wrap gap-4 ">
                <div className="flex-1 flex flex-col pt-10 rounded-2xl justify-around bg-gradient-to-r  from-gray-50 to-gray-100  shadow-xl shadow-gray-300">
                    <canvas id="myChart" width="400" height="200"></canvas>
                    <div className=" flex flex-row px-4 py-4 flex-wrap gap-4">
                        <div className="flex-1 rounded-2xl   bg-[#FF9300] shadow-xl shadow-[#f3c17b55]">
                            <select
                                className="w-full h-[60px] text-center rounded-lg  "
                                value={selectedChartType}
                                onChange={(e) =>
                                    setSelectedChartType(e.target.value)
                                }
                            >
                              <option value="bar">Graphique à barres</option>
                                <option value="line">Graphique linéaire</option>
                                <option value="pie">Graphique circulaire</option>
                                <option value="doughnut">Graphique en anneau</option>
                                <option value="polarArea">
                                    Graphique en secteurs polaires
                                </option>
                                <option value="radar">Graphique en radar</option>
                                <option value="bubble">Graphique à bulles</option>
                                <option value="scatter">Graphique de dispersion</option>

                            </select>
                        </div>
                        <div className="flex-1 rounded-2xl   bg-[#068FF1] shadow-lg   shadow-[#b5d9f2]">
                            <select
                                className="w-full  h-[60px] text-center rounded-lg "
                                value={selectedGraphOption}
                                onChange={(e) =>
                                    setSelectedGraphOption(e.target.value)
                                }
                            >
                                <option value="">Projets</option>
                                {projects?.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 rounded-2xl   bg-[#05EB07] shadow-xl   shadow-[#c5e8c5]">
                            <select
                                className="w-full h-[60px] text-center rounded-lg"
                                value={selectedSprintOption}
                                onChange={(e) =>
                                    setSelectedSprintOption(e.target.value)
                                }
                            >
                                <option value="all">Tous les phases</option>
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
                            <h3 className="text-3xl font-semibold m-4  text-black">                   
                Meilleurs finisseurs de Taches
                            </h3>
                            {topTicketFinishers.map((user) => (
                                <div
                                    key={user.id}
                                    className=" p-3 flex items-center justify-between mt-2 border-b-[1px]"
                                >
                                    <div className="flex space-x-6 items-center ">
                                        <div className="flex-shrink-0">  <img
                                            src={user.profile_picture}
                                            className="w-12 h-12 rounded-full "
                                        /></div>
                                      
                                        <div>
                                            <p className="font-semibold text-base">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        <div className=" rounded-md p-5 justify-around gap-3 flex items-center text-2xl text-black font-bold">
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
                    <h3 className="text-3xl font-semibold m-4  text-black">                   
                            Meilleurs finisseurs des Projets
                            </h3>
                            {topprojectmanagers.map((user) => (
                                <div
                                    key={user.id}
                                    className=" p-3 flex items-center justify-between mt-2 border-b-[1px]"
                                >
                                  <div className="flex space-x-6 items-center ">
                                        <div className="flex-shrink-0">  <img
                                            src={user.profile_picture}
                                            className="w-12 h-12 rounded-full "
                                        /></div>
                                      
                                        <div>
                                            <p className="font-semibold text-base">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                    <div className=" rounded-md p-5 justify-around gap-3 flex items-center text-2xl text-black font-bold">
                                        <ion-icon name="code-outline"></ion-icon>
                                            {user.project_count ?? 0}
                                        </div>
                                    </div>
                                </div>
                            ))}
                              {topprojectmanagers.map((user) => (
                                <div
                                    key={user.id}
                                    className=" p-3 flex items-center justify-between mt-2 border-b-[1px]"
                                >
                                  <div className="flex space-x-6 items-center ">
                                        <div className="flex-shrink-0">  <img
                                            src={user.profile_picture}
                                            className="w-12 h-12 rounded-full "
                                        /></div>
                                      
                                        <div>
                                            <p className="font-semibold text-base">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                    <div className=" rounded-md p-5 justify-around gap-3 flex items-center text-2xl text-black font-bold">
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
