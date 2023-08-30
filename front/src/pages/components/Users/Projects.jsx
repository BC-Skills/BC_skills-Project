/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../../contexts/contextProvider";
import axiosClient from "../../../axios";
import Cards from "./Componets/cards";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddProject from "../../model/AddProject";
import DetailsProject from "../../model/DetailsProject";
import Collaborator from "../../model/Collaborator";
import Sprints from "../../model/Sprints";
const localStorageKey = "projectsData";
const completedProjectsKey = "completedProjects";
const pendingProjectsKey = "pendingProjects";
const startProjectsKey = "startProjects";

export default function Projects() {
    const storedLinks = localStorage.getItem("links");
    const { currentUser, profile } = useStateContext();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [showModal, setShowModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false); 
    const [Collaborateur, setCollaborateur] = useState(false); 
    const [selectedUserId, setSelectedProject] = useState({});
    const navigate = useNavigate();
    const [sprints, setSprints] = useState(false); // New state variable for the EditModels modal
    const [completedProjectscount, setCompletedProjectscount] = useState(0);
    const [inProgressProjectscount, setInProgressProjectscount] = useState(0);
    const [startProjectscount, setStartProjectscount] = useState(0);
    const [allProjectscount, setAllProjectscount] = useState(0);

    const [withValuecompleted, setWithValuecompleted] = useState(0);
    const [withValuePending, setWithValuePending] = useState(0);
    const [withValueStart, setWithValueStart] = useState(0);

    const [completedProjects, setCompletedProjects] = useState([]);
    const [pendingProjects, setPendingProjects] = useState([]);
    const [startProjects, setStartProjects] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenEditModal = (project) => {
        setSelectedProject(project);
        setEditModalOpen(true);
    };

    // Function to close the EditModels modal
    const handleCloseEditModal = () => {
        setSelectedProject({});
        setEditModalOpen(false);
    };

    const handleCollaboratoropen = (project) => {
        setSelectedProject(project);
        setCollaborateur(true);
    };

    // Function to close the EditModels modal
    const handleCollaboratorclose = () => {
        setSelectedProject({});
        setCollaborateur(false);
    };

    const handleSprintsropen = (project) => {
        setSelectedProject(project);
        setSprints(true);
    };

    // Function to close the EditModels modal
    const handleSprintsclose = () => {
        setSelectedProject({});
        setSprints(false);
    };

    const [shouldShowAddButton, setShouldShowAddButton] = useState(false);
    const [shouldEnableDragDrop, setShouldEnableDragDrop] = useState(true);
    const [show, setshow] = useState(false);
    const [edit, setedit] = useState(false);


    useEffect(() => {
        const storedLinks = localStorage.getItem("links");
        const parsedLinks = JSON.parse(storedLinks) || [];
    
        const hasProjectsLink = parsedLinks.some(link => link.name === "projets");
    
        if (!hasProjectsLink) {
            navigate("/users");
        } else {
            parsedLinks.forEach(link => {
                if (link.name === "projets") {
                    const hasAddPrivilege = link.privilegeNames.includes("add");
                    const hasEditPrivilege = link.privilegeNames.includes("edit");
                    const shows = link.privilegeNames.includes("show");

                    setShouldShowAddButton(hasAddPrivilege);
                    setShouldEnableDragDrop(hasEditPrivilege);
                    setedit(hasEditPrivilege)
                    setshow(shows)
                }
            });
        }
    }, []);
  
    const fetchProjects = async () => {
        try {
            const response = await axiosClient.get(
                `projects/manager/${currentUser.id}`
            );
            const projectsData = response.data;

            // Categorize projects based on their status
            const completedProjects = projectsData.filter(
                (project) => project.status === "Completed"
            );
            const pendingProjects = projectsData.filter(
                (project) => project.status === "Pending"
            );
            const startProjects = projectsData.filter(
                (project) => project.status === "Start"
            );

            setProjects(projectsData);
            setCompletedProjects(completedProjects);
            setPendingProjects(pendingProjects);
            setStartProjects(startProjects);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching projects:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchProjects();
    }, []);

    useEffect(() => {
        getCount();
    }, [projects]);


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

            // Clear storage and call fetchProjects again
            sessionStorage.removeItem(localStorageKey);
            sessionStorage.removeItem(completedProjectsKey);
            sessionStorage.removeItem(pendingProjectsKey);
            sessionStorage.removeItem(startProjectsKey);
            setLoading(true);
            getCount();
            // Set loading to true to indicate data fetching
            fetchProjects(); // Call fetchProjects again to refetch the updated data
        } catch (error) {
            console.error("Error updating project status:", error);
        }
    };

   

    const getCount = async () => {
        try {
            // Fetch count of completed projects
            const allResponse = await axiosClient.get(
                `/projects/count/manager/${currentUser.id}`
            );

            setCompletedProjectscount(allResponse.data.Completed);

            // Fetch count of projects in progress (pending)
            setInProgressProjectscount(allResponse.data.Pending);

            // Fetch count of projects in start state
            setStartProjectscount(allResponse.data.Start);

            // Fetch count of all projects
            setAllProjectscount(allResponse.data.count);

            const pendingPercentage =
                (allResponse.data.Pending / allResponse.data.count) * 100;
            setWithValuePending(pendingPercentage);
            const startPercentage =
                (allResponse.data.Start / allResponse.data.count) * 100;
            setWithValueStart(startPercentage);
            const completePercentage =
                (allResponse.data.Completed / allResponse.data.count) * 100;
            setWithValuecompleted(completePercentage);
        } catch (error) {
            console.error("Error fetching project counts:", error);
        }
    };


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };
    
      const filteredStartProjects = startProjects.filter(
        (project) =>
          project.nom?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const filteredPendingProjects = pendingProjects.filter(
        (project) =>
          project.nom?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const filteredCompletedProjects = completedProjects.filter(
        (project) =>
          project.nom?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return (
        <div className="flex-1 flex flex-col p-4 pb-0">
            <div className="h-[100px] flex justify-between  items-center">
                <div className="mt-5 mb-2 border-2 py-1 px-3 flex justify-between  rounded-md hover:border-blue-500">
                    <input
                        id="searchInput"
                        className="flex-grow outline-none text-gray-600 focus:text-blue-600"
                        type="text"
                        
                        placeholder="Rechercher un Projet..."
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
                            {" "}
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                </div>
                <div className="">
                {shouldShowAddButton && (
                    <button
                        type="button"
                        onClick={handleShowModal}
                        className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-[#41415A] to-voilet-500 sm:ml-auto shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                    >
                        <svg
                            className="mr-2 -ml-1 w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"></path>
                        </svg>
                        Ajouter un projet
                    </button>
                )}
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
            {show ? (
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 flex flex-row justify-around gap-6">
                    <div className="flex-1 bg-white  flex flex-col">
                        <div className="h-[50px] gap-3 flex relative rounded-t-lg overflow-hidden bg-violet-300 ">
                            <div
                                className={`h-full flex justify-center items-center bg-violet-900 `}
                                style={{ width: `${withValueStart}%` }}
                            ></div>

                            <div className="absolute text-white inset-0 flex items-center justify-center text-sm font-medium">
                                <ion-icon
                                    size="large"
                                    name="checkmark-circle-outline"
                                ></ion-icon>
                                <h1 className="text-[25px] font-bold text-white">
                                    A faire
                                </h1>
                                <h1 className="font-bold ml-11 text-[25px] text-red">
                                    {startProjectscount}/{allProjectscount}
                                </h1>
                            </div>
                        </div>{" "}
                        {loading ? (
                            <div>Chargement...</div>
                        ) : (
                            <Droppable droppableId="startProjects"
                            isDropDisabled={!shouldEnableDragDrop} // Disable drag-and-drop based on privilege
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex-1 p-5 pt-10 flex flex-col gap-4 rounded-lg shadow-lg bg-[#EFF2F7]"
                                    >
                                        {filteredStartProjects.map(
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
                                                                onEditProject={
                                                                    handleOpenEditModal
                                                                }
                                                                AddCollaboratorProject={
                                                                    handleCollaboratoropen
                                                                }
                                                                AddSprintsProject={
                                                                    handleSprintsropen
                                                                }
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
                        )}
                    </div>
                    <div className="flex-1 bg-white  flex flex-col">
                        <div className="h-[50px] gap-3 flex relative  rounded-t-lg overflow-hidden bg-orange-300 ">
                            <div
                                className={` h-full flex justify-center items-center bg-orange-500 `}
                                style={{ width: `${withValuePending}%` }}
                            ></div>
                            <div className="absolute text-white inset-0 flex items-center justify-center text-sm font-medium ">
                                <ion-icon
                                    size="large"
                                    name="checkmark-circle-outline"
                                ></ion-icon>
                                <h1 className="text-[25px] font-bold">
                                En Cours
                                </h1>
                                <h1 className="font-bold ml-11  text-[25px] text-red">
                                    {inProgressProjectscount}/{allProjectscount}
                                </h1>
                            </div>
                        </div>
                        {loading ? (
                            // Loading indicator or message while data is being fetched
                            <div>Chargement...</div>
                        ) : (
                            <Droppable droppableId="pendingProjects"
                            isDropDisabled={!shouldEnableDragDrop} // Disable drag-and-drop based on privilege

                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex-1 p-5 pt-10 flex flex-col gap-4 rounded-lg shadow-lg bg-[#EFF2F7]"
                                    >
                                        {filteredPendingProjects.map(
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
                                                                onEditProject={
                                                                    handleOpenEditModal
                                                                }
                                                                AddCollaboratorProject={
                                                                    handleCollaboratoropen
                                                                }
                                                                AddSprintsProject={
                                                                    handleSprintsropen
                                                                }
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
                        )}
                    </div>
                    <div className="flex-1 bg-white  flex flex-col">
                        <div className="h-[50px] gap-3 flex relative  rounded-t-lg overflow-hidden  bg-green-400 ">
                            <div
                                className={` h-full flex justify-center items-center  bg-green-800`}
                                style={{ width: `${withValuecompleted}%` }}
                            ></div>
                            <div className="absolute text-white inset-0 flex items-center justify-center text-sm font-medium ">
                                <ion-icon
                                    size="large"
                                    name="checkmark-circle-outline"
                                ></ion-icon>
                                <h1 className="text-[25px] font-bold">
                                Fini
                                </h1>
                                <h1 className="font-bold ml-11  text-[25px] text-red">
                                    {completedProjectscount}/{allProjectscount}
                                </h1>
                            </div>
                        </div>
                        {loading ? (
                            // Loading indicator or message while data is being fetched
                            <div>Loading...</div>
                        ) : (
                            <Droppable droppableId="completedProjects"
                            isDropDisabled={!shouldEnableDragDrop} // Disable drag-and-drop based on privilege

                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex-1 p-5 pt-10 flex flex-col gap-4 rounded-lg shadow-lg bg-[#EFF2F7]"
                                    >
                                        {filteredCompletedProjects.map(
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
                                                                onEditProject={
                                                                    handleOpenEditModal
                                                                }
                                                                AddCollaboratorProject={
                                                                    handleCollaboratoropen
                                                                }
                                                                AddSprintsProject={
                                                                    handleSprintsropen
                                                                }
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
                        )}
                    </div>
                </div>
            </DragDropContext>
              ) : (
                // If `show` is false, render this content
                <div className="flex-1 text-[20px] font-bold flex justify-center items-center">
                    <p>Contenu vide</p>
                </div>
            )}
            {showModal && (
                <AddProject
                    onCloseModal={handleCloseModal}
                    fetchUsersData={fetchProjects}
                />
            )}
            {editModalOpen && (
                <DetailsProject
                    project={selectedUserId}
                    onCloseModal={handleCloseEditModal}
                />
            )}
            {edit && Collaborateur && (
                <Collaborator
                    project={selectedUserId}
                    onCloseModal={handleCollaboratorclose}
                />
            )}
            {edit && sprints && (
                <Sprints
                    project={selectedUserId}
                    onCloseModal={handleSprintsclose}
                />
            )}
        </div>
    );
}
