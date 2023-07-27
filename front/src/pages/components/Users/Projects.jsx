/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../../contexts/contextProvider";
import axiosClient from "../../../axios";
import Cards, { Header } from "./Componets/cards";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export default function Projects() {
    const storedLinks = localStorage.getItem("links");
    const { currentUser, profile } = useStateContext();
    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        const parsedLinkss = JSON.parse(storedLinks) || [];
        const hasProjectsLink = parsedLinkss.some(
            (link) => link.name === "projets"
        );
        console.log(parsedLinkss);
        if (!hasProjectsLink) {
            navigate("/users");
        }
    }, [storedLinks]);

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
        const employeeTable = document.getElementById("employeeTable");
        const tableRows = employeeTable.getElementsByTagName("tr");
        handleSearchChange(searchText, tableRows);
    };
    const searchInputRef = useRef(null);
    useEffect(() => {
        const searchInput = searchInputRef.current;
        if (searchInput) {
            searchInput.addEventListener("input", handleSearch);
        }

        // Remove the event listener when the component unmounts
        return () => {
            if (searchInput) {
                searchInput.removeEventListener("input", handleSearch);
            }
        };
    }, []);

    const [completedProjects, setCompletedProjects] = useState([]);
    const [pendingProjects, setPendingProjects] = useState([]);
    const [startProjects, setStartProjects] = useState([]);

    const fetchProjects = async () => {
        try {
          const response = await axiosClient.get("projects");
          const projectsData = response.data;
      
          const updatedProjects = await Promise.all(
            projectsData.map(async (project) => {
              const clientResponse = await axiosClient.get(`users/${project.client_id}`);
              const projectManagerResponse = await axiosClient.get(`users/${project.project_manager_id}`);
              const client = clientResponse.data;
              const projectManager = projectManagerResponse.data;
              return { ...project, client, projectManager };
            })
          );
      
          // Categorize projects based on their status
          const completedProjects = updatedProjects.filter((project) => project.status === "Completed");
          const pendingProjects = updatedProjects.filter((project) => project.status === "Pending");
          const startProjects = updatedProjects.filter((project) => project.status === "Start");
      
          // Store the categorized projects in sessionStorage
          sessionStorage.setItem("completedProjects", JSON.stringify(completedProjects));
          sessionStorage.setItem("pendingProjects", JSON.stringify(pendingProjects));
          sessionStorage.setItem("startProjects", JSON.stringify(startProjects));
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
      
      useEffect(() => {
        // Check if the projects are already stored in sessionStorage to avoid fetching again
        const storedCompletedProjects = sessionStorage.getItem("completedProjects");
        const storedPendingProjects = sessionStorage.getItem("pendingProjects");
        const storedStartProjects = sessionStorage.getItem("startProjects");
      
        if (storedCompletedProjects && storedPendingProjects && storedStartProjects) {
          // Projects are already in sessionStorage, parse and set them in state
          setCompletedProjects(JSON.parse(storedCompletedProjects));
          setPendingProjects(JSON.parse(storedPendingProjects));
          setStartProjects(JSON.parse(storedStartProjects));
        } else {
          // Projects are not in sessionStorage, fetch and store them
          fetchProjects();
        }
      }, []);
      

    const [withValue, setWithValue] = useState(`w-[50%]`);

    const onDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;

        // Get the dragged project based on the source index and droppableId
        const draggedProject =
            source.droppableId === "startProjects"
                ? startProjects[source.index]
                : source.droppableId === "pendingProjects"
                ? pendingProjects[source.index]
                : completedProjects[source.index];

        // Update the status of the dragged project based on the destination droppableId
        let updatedDraggedProject;
        if (destination.droppableId === "startProjects") {
            updatedDraggedProject = { ...draggedProject, status: "Start" };
        } else if (destination.droppableId === "pendingProjects") {
            updatedDraggedProject = { ...draggedProject, status: "Pending" };
        } else if (destination.droppableId === "completedProjects") {
            updatedDraggedProject = { ...draggedProject, status: "Completed" };
        }

        // Update the respective lists based on the updated project status
        setStartProjects((prevStartProjects) =>
            source.droppableId === "startProjects"
                ? [
                      ...prevStartProjects.slice(0, source.index),
                      ...prevStartProjects.slice(source.index + 1),
                  ]
                : prevStartProjects
        );

        setPendingProjects((prevPendingProjects) =>
            source.droppableId === "pendingProjects"
                ? [
                      ...prevPendingProjects.slice(0, source.index),
                      ...prevPendingProjects.slice(source.index + 1),
                  ]
                : prevPendingProjects
        );

        setCompletedProjects((prevCompletedProjects) =>
            source.droppableId === "completedProjects"
                ? [
                      ...prevCompletedProjects.slice(0, source.index),
                      ...prevCompletedProjects.slice(source.index + 1),
                  ]
                : prevCompletedProjects
        );

        // Update the destination list based on the updated project status
        if (destination.droppableId === "startProjects") {
            setStartProjects((prevStartProjects) => [
                ...prevStartProjects.slice(0, destination.index),
                updatedDraggedProject,
                ...prevStartProjects.slice(destination.index),
            ]);
        } else if (destination.droppableId === "pendingProjects") {
            setPendingProjects((prevPendingProjects) => [
                ...prevPendingProjects.slice(0, destination.index),
                updatedDraggedProject,
                ...prevPendingProjects.slice(destination.index),
            ]);
        } else if (destination.droppableId === "completedProjects") {
            setCompletedProjects((prevCompletedProjects) => [
                ...prevCompletedProjects.slice(0, destination.index),
                updatedDraggedProject,
                ...prevCompletedProjects.slice(destination.index),
            ]);
        }

        // Make API request to update the project status
        try {
            await axiosClient.put(`projects/${updatedDraggedProject.id}`, {
                status: updatedDraggedProject.status,
            });
        } catch (error) {
            console.error("Error updating project status:", error);
        }
    };

    return (
        <div className="flex-1 flex flex-col p-4">
            <div className="h-[100px] flex justify-between  items-center">
                <div className="mt-5 mb-2 border-2 py-1 px-3 flex justify-between  rounded-md hover:border-blue-500">
                    <input
                        ref={searchInputRef}
                        id="searchInput"
                        className="flex-grow outline-none text-gray-600 focus:text-blue-600"
                        type="text"
                        placeholder="Search Employee..."
                    />
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-400 focus:text-blue-400 transition duration-100 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {" "}
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                </div>
                <div className="">
                    <button
                        type="button"
                        onClick={console.log("hye")}
                        className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-blue-600 to-voilet-500 sm:ml-auto shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                    >
                        <svg
                            className="mr-2 -ml-1 w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"></path>
                        </svg>
                        Add Project
                    </button>
                </div>
                <div className="flex flex-row gap-6 justify-center items-center">
                    <div className="flex-1">
                        <h1 className="text-[20px] font-bold">
                            {currentUser.name}
                        </h1>
                        <h1 className="text-[15px] font-bold text-blue-400">
                            {profile.name}
                        </h1>
                    </div>

                    <div className="user">
                        <img
                            className="flex-1"
                            src={currentUser.profile_picture}
                            alt="Profile Picture"
                        />
                    </div>
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 flex flex-row justify-around gap-6">
                    <div className="flex-1 bg-white gap-10 flex flex-col">
                        <Header withValue={withValue} />
                        <Droppable droppableId="startProjects">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex-1 p-2 flex flex-col gap-6 rounded-3xl shadow-2xl bg-gray-300"
                                >
                                    {startProjects.map((project, index) => (
                                        <Draggable
                                            key={project.id}
                                            draggableId={project.id.toString()}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Cards
                                                        project={project}
                                                        key={project.id}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div className="flex-1 bg-white gap-10 flex flex-col">
                        <div className="h-[50px] gap-3 flex relative rounded-xl overflow-hidden bg-orange-300 shadow-md shadow-gray-400">
                            <div
                                className={` h-full flex justify-center items-center bg-orange-500 ${withValue}`}
                            ></div>

                            <div className="absolute text-white inset-0 flex items-center justify-center text-sm font-medium ">
                                <ion-icon
                                    size="large"
                                    name="checkmark-circle-outline"
                                ></ion-icon>
                                <h1 className="text-[25px] font-bold">
                                    Panding
                                </h1>
                                <h1 className="font-bold ml-11  text-lg text-red">
                                    13/17
                                </h1>
                            </div>
                        </div>
                            <Droppable droppableId="pendingProjects">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex-1 p-2 flex flex-col gap-6 rounded-3xl shadow-2xl bg-gray-300"
                                    >
                                        {pendingProjects.map(
                                            (project, index) => (
                                                <Draggable
                                                    key={project.id}
                                                    draggableId={project.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Cards
                                                                project={
                                                                    project
                                                                }
                                                                key={project.id}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                    </div>
                    <div className="flex-1 bg-white gap-10 flex flex-col">
                        <div className="h-[50px] gap-3 flex relative rounded-xl overflow-hidden shadow-md bg-green-400 shadow-gray-400">
                            <div
                                className={` h-full flex justify-center items-center  bg-green-800 ${withValue}`}
                            ></div>
                            <div className="absolute text-white inset-0 flex items-center justify-center text-sm font-medium ">
                                <ion-icon
                                    size="large"
                                    name="checkmark-circle-outline"
                                ></ion-icon>
                                <h1 className="text-[25px] font-bold">
                                    Completed
                                </h1>
                                <h1 className="font-bold ml-11  text-lg text-red">
                                    13/17
                                </h1>
                            </div>
                        </div>
                            <Droppable droppableId="completedProjects">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex-1 p-2 gap-6 scroll-auto flex flex-col rounded-3xl shadow-2xl bg-gray-300"
                                    >
                                        {completedProjects.map(
                                            (project, index) => (
                                                <Draggable
                                                    key={project.id}
                                                    draggableId={project.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Cards
                                                                project={
                                                                    project
                                                                }
                                                                key={project.id}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}
