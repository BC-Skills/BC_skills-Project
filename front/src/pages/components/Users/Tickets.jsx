import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./tickets/header";
import Cardtickes from "./tickets/Cardtickes";
import axiosClient from "../../../axios";
import { useStateContext } from "../../../contexts/contextProvider";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { CSSTransition } from "react-transition-group";
import "../../../assets/css/animation.css";
import Sprints from "./tickets/sprints";
import Cardticket2 from "./tickets/Cardticket2";

const Tickets = () => {
    const storedLinks = localStorage.getItem("links");
    const navigate = useNavigate();
    const [tickets, setTickets] = useState({
        todo: [],
        inProgress: [],
        done: [],
    });
    const [ticketss, setTicketss] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSprint, setselectedSprint] = useState(null);
    const { currentUser } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [todoForm, setTodoForm] = useState(false);
    const [inProgressForm, setInProgressForm] = useState(false);
    const [doneForm, setDoneForm] = useState(false);
    const [ticketNameTodo, setTicketNameTodo] = useState("");
    const [ticketNameInProgress, setTicketNameInProgress] = useState("");
    const [ticketNameDone, setTicketNameDone] = useState("");

    const [shouldShowAddButton, setShouldShowAddButton] = useState(false);
    const [shouldEnableDragDrop, setShouldEnableDragDrop] = useState(true);
    const [show, setshow] = useState(false);

    const [shouldEnableDragDropSprints, setShouldEnableDragDropSprints] =
        useState(false);
    const [showSprints, setshowSprints] = useState(false);
    const [modifuy, setShouldmodify] = useState(false);
    const { profile } = useStateContext();
    const [dev, setdev] = useState(false);

    useEffect(() => {
        if (profile.name === "developer") {
            setdev(true);
            fetchTicketData();
        } else {
            setLoading(true);
        }
    }, []);

    useEffect(() => {
        const parsedLinks = JSON.parse(storedLinks) || [];
        const hasProjectsLink = parsedLinks.some(
            (link) => link.name === "tickets"
        );

        if (!hasProjectsLink) {
            navigate("/users");
        } else {
            parsedLinks.forEach((link) => {
                if (link.name === "tickets") {
                    if (
                        link.privilegeNames &&
                        Array.isArray(link.privilegeNames)
                    ) {
                        const hasAddPrivilege =
                            link.privilegeNames.includes("add");
                        const hasEditPrivilege =
                            link.privilegeNames.includes("edit");
                        const shows = link.privilegeNames.includes("show");

                        setShouldShowAddButton(hasAddPrivilege);
                        setShouldEnableDragDrop(hasEditPrivilege);
                        setShouldmodify(hasEditPrivilege);
                        setshow(shows);
                    }
                }
            });

            parsedLinks.forEach((link) => {
                if (link.name === "sprints") {
                    if (
                        link.privilegeNames &&
                        Array.isArray(link.privilegeNames)
                    ) {
                        // const hasAddPrivilege = link.privilegeNames.includes("add");
                        const hasEditPrivilege =
                            link.privilegeNames.includes("edit");
                        const shows = link.privilegeNames.includes("show");

                        setShouldEnableDragDropSprints(hasEditPrivilege);
                        setshowSprints(shows);
                    }
                }
            });
        }
    }, [storedLinks, navigate]);

    useEffect(() => {
        if (selectedProject !== null) {
            fetchUsersData();
        } else {
            setLoading(true);
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedProject !== null) {
            fetchUsersData2();
        } else {
            fetchUsersData();
        }
    }, [selectedSprint]);

    const fetchTicketData = async () => {
        try {
            const response = await axiosClient.get(`ticketsss/${currentUser.id}`);
            const allTicketsData = response.data;
            setTicketss(allTicketsData);
            console.log(allTicketsData);
        } catch (error) {
            console.log("Error fetching tickets:", error);
        }
    };

    const fetchUsersData = async () => {
        setLoading(true);
        if (selectedProject !== null) {
            try {
                const response = await axiosClient.get(
                    `ticketss/${selectedProject}`
                );
                const allTicketsData = response.data;

                // Filter the tickets based on their status
                const ticketsTodo = allTicketsData.filter(
                    (ticket) => ticket.status === "A faire"
                );
                const ticketsInProgress = allTicketsData.filter(
                    (ticket) => ticket.status === "En Cours"
                );
                const ticketsDone = allTicketsData.filter(
                    (ticket) => ticket.status === "Fini"
                );

                // Set the filtered tickets in the state
                setTickets({
                    todo: ticketsTodo,
                    inProgress: ticketsInProgress,
                    done: ticketsDone,
                });
                setLoading(false);
            } catch (error) {
                console.log("Error fetching tickets:", error);
                setLoading(false);
            }
        } else {
            setLoading(true);
        }
    };

    const fetchUsersData2 = async () => {
        console.log(selectedSprint);
        setLoading(true);
        if (selectedProject !== "") {
            try {
                if (selectedSprint !== "") {
                    if (selectedSprint === "Without") {
                        const response = await axiosClient.get(
                            `projects/${selectedProject}/tickets-without-sprint`
                        );
                        const allTicketsData = response.data;

                        // Filter and set the tickets based on their status
                        const ticketsTodo = allTicketsData.filter(
                            (ticket) => ticket.status === "A faire"
                        );
                        const ticketsInProgress = allTicketsData.filter(
                            (ticket) => ticket.status === "En Cours"
                        );
                        const ticketsDone = allTicketsData.filter(
                            (ticket) => ticket.status === "Fini"
                        );

                        setTickets({
                            todo: ticketsTodo,
                            inProgress: ticketsInProgress,
                            done: ticketsDone,
                        });
                        setLoading(false);
                    } else {
                        const response = await axiosClient.get(
                            `/ticketss/projectss/${selectedProject}/sprintss/${selectedSprint}`
                        );
                        const allTicketsData = response.data;

                        // Filter and set the tickets based on their status
                        const ticketsTodo = allTicketsData.filter(
                            (ticket) => ticket.status === "A faire"
                        );
                        const ticketsInProgress = allTicketsData.filter(
                            (ticket) => ticket.status === "En Cours"
                        );
                        const ticketsDone = allTicketsData.filter(
                            (ticket) => ticket.status === "Fini"
                        );

                        // Set the filtered tickets in the state
                        setTickets({
                            todo: ticketsTodo,
                            inProgress: ticketsInProgress,
                            done: ticketsDone,
                        });
                        setLoading(false);
                    }
                } else {
                    fetchUsersData();
                }
            } catch (error) {
                console.log("Error fetching tickets:", error);
                setLoading(false);
            }
        } else {
            setLoading(false); // No selected project, so set loading to false
        }
    };

    const handleProjectSelect = (selectedProject) => {
        setSelectedProject(selectedProject);
    };
    const handleSprintSelect = (selectedProject) => {
        setselectedSprint(selectedProject);
    };

    const handleCreateTicketTodo = () => {
        setTodoForm(true);
    };

    const handleCreateTicketInProgress = () => {
        setInProgressForm(true);
    };

    const handleCreateTicketDone = () => {
        setDoneForm(true);
    };

    const handleSubmitTicketTodo = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.post("ticketss", {
                nom: ticketNameTodo,
                status: "A faire",
                project_id: selectedProject,
                user_id: currentUser.id,
            });
            fetchUsersData();

            console.log("Ticket created successfully:", response.data);
            setTicketNameTodo("");

            setTodoForm(false);
        } catch (error) {
            console.log("Error creating ticket:", error);
            setLoading(false);
        }
    };

    const handleSubmitTicketInProgress = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axiosClient.post("ticketss", {
                nom: ticketNameInProgress,
                status: "En Cours",
                project_id: selectedProject,
                user_id: currentUser.id,
            });
            fetchUsersData();
            console.log("Ticket created successfully:", response.data);
            setTicketNameInProgress("");
            setInProgressForm(false);
        } catch (error) {
            console.log("Error creating ticket:", error);
            setLoading(false);
        }
    };

    const handleSubmitTicketDone = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axiosClient.post("ticketss", {
                nom: ticketNameDone,
                status: "Fini",
                project_id: selectedProject,
                user_id: currentUser.id,
            });
            fetchUsersData();
            console.log("Ticket created successfully:", response.data);
            setTicketNameDone("");
            setDoneForm(false);
        } catch (error) {
            console.log("Error creating ticket:", error);
            setLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }
        const { source, destination, draggableId } = result;
        if (source.droppableId !== destination.droppableId) {
            const ticketId = draggableId;
            const newStatus =
                destination.droppableId === "En_Cours"
                    ? "En Cours"
                    : destination.droppableId === "Fini"
                    ? "Fini"
                    : "A faire";
            try {
                // Update ticket status in the API
                await axiosClient.put(`ticketss/${ticketId}`, {
                    status: newStatus,
                });
                fetchUsersData(); // Refresh ticket data after the update
            } catch (error) {
                console.log("Error updating ticket status:", error);
            }
        }
    };

    const [showAdditionalContent, setShowAdditionalContent] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    // Filter tickets based on the search query
    const filteredTickets = ticketss.filter(
        (tick) =>
            tick.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tick.user?.name &&
                tick.user.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))
    );

    return (
        <>
            {show ? (
                <>
                    {dev ? (
                        <div className="flex-1  flex  flex-col">
                            <div className="h-[100px] flex justify-between items-center">
                                <div className="mt-5 mb-2 border-2 py-1 px-3 flex justify-between  rounded-md hover:border-blue-500">
                                    <input
                                        id="searchInput"
                                        className="flex-grow outline-none text-gray-600 focus:text-blue-600"
                                        type="text"
                                        placeholder="Search Project..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
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
                            <div className="flex-1 m-10 bg-gray-100 shadow-2xl ">
                            <div className="flex pb-8 max-h-[80vh] overflow-y-auto flex-wrap p-5">
                                    {filteredTickets.map((tick) => (
                                     <Cardticket2
                                            key={tick.id}
                                            tick={tick}
                                        />
                                       
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <div className="flex-1 flex flex-col pb-6">
                                <Header
                                    onSelectProject={handleProjectSelect}
                                    onSelectSprint={handleSprintSelect}
                                />
                                <div className="flex-1 flex gap-10 flex-wrap   sm:flex-col lg:flex-row mt-12">
                                    <div className="flex-[1.5]  flex gap-10 rounded-2xl overflow-hidden  flex-wrap flex-row">
                                        <div className="flex-1 min-w-[300px] flex flex-col justify-between bg-gray-100 rounded-xl shadow-2xl">
                                            <div className="h-[50px] flex first-letter text-black bg-violet-300 pl-10 pr-10 p-10 justify-between items-center">
                                                <h1 className="text-2xl">
                                                    A faire
                                                </h1>
                                            </div>
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : (
                                                <Droppable
                                                    droppableId="A_faire"
                                                    isDropDisabled={
                                                        !shouldEnableDragDrop
                                                    }
                                                >
                                                    {(provided) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            className="flex-1 max-h-[800px] flex flex-col gap-5 p-8 overflow-auto"
                                                        >
                                                            {tickets.todo
                                                                .length > 0 ? (
                                                                tickets.todo.map(
                                                                    (
                                                                        ticket,
                                                                        index
                                                                    ) => (
                                                                        <Draggable
                                                                            key={
                                                                                ticket.id
                                                                            }
                                                                            draggableId={ticket.id.toString()}
                                                                            index={
                                                                                index
                                                                            }
                                                                        >
                                                                            {(
                                                                                provided
                                                                            ) => (
                                                                                <div
                                                                                    ref={
                                                                                        provided.innerRef
                                                                                    }
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                >
                                                                                    <Cardtickes
                                                                                        key={
                                                                                            ticket.id
                                                                                        }
                                                                                        tickets={
                                                                                            ticket
                                                                                        }
                                                                                        fetchticketsData={
                                                                                            fetchUsersData
                                                                                        }
                                                                                        selectedProject={
                                                                                            selectedProject
                                                                                        }
                                                                                        modifuy={
                                                                                            modifuy
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    )
                                                                )
                                                            ) : (
                                                                <p>
                                                                    No tickets
                                                                    found.
                                                                </p>
                                                            )}
                                                            {
                                                                provided.placeholder
                                                            }{" "}
                                                            {/* Include the placeholder */}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            )}
                                            {shouldShowAddButton && (
                                                <div className="h-[50px] flex mt-8 first-letter pb-10 justify-between items-center">
                                                    {!todoForm && (
                                                        <button
                                                            className="h-[50px] flex-1 flex first-letter text-2xl pl-10 pr-10 p-10 justify-start items-center border border-gray-300 rounded-md hover:border-blue-500"
                                                            onClick={
                                                                handleCreateTicketTodo
                                                            }
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="30"
                                                                height="30"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                className="mr-2"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                                />
                                                            </svg>
                                                            Crée tickets
                                                        </button>
                                                    )}
                                                    {todoForm && (
                                                        <form
                                                            onSubmit={
                                                                handleSubmitTicketTodo
                                                            }
                                                            className="flex items-start justify-center flex-1"
                                                        >
                                                            <input
                                                                type="text"
                                                                value={
                                                                    ticketNameTodo
                                                                }
                                                                onChange={(e) =>
                                                                    setTicketNameTodo(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Enter ticket name"
                                                                className="p-2 m-2 border  border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                                                            />
                                                            <button
                                                                type="submit"
                                                                className=" flex first-letter text-2xl h-[40px] mt-2  justify-start items-center border border-gray-300 rounded-md hover:border-blue-500"
                                                            >
                                                                Create Ticket
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-[300px] flex flex-col justify-between bg-gray-100 rounded-xl shadow-2xl">
                                            <div className="h-[50px] flex first-letter pl-10 pr-10 p-10 justify-between bg-orange-300 items-center">
                                                <h1 className="text-2xl">
                                                    En Cours
                                                </h1>
                                            </div>
                                            {loading ? (
                                                <p>Loading..</p>
                                            ) : (
                                                <Droppable
                                                    droppableId="En_Cours"
                                                    isDropDisabled={
                                                        !shouldEnableDragDrop
                                                    }
                                                >
                                                    {(provided) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            className="flex-1 max-h-[800px] flex flex-col gap-5 p-8 overflow-auto"
                                                        >
                                                            {loading ? (
                                                                <p>
                                                                    Loading...
                                                                </p>
                                                            ) : tickets
                                                                  .inProgress
                                                                  .length ? (
                                                                tickets.inProgress.map(
                                                                    (
                                                                        ticket,
                                                                        index
                                                                    ) => (
                                                                        <Draggable
                                                                            key={
                                                                                ticket.id
                                                                            }
                                                                            draggableId={ticket.id.toString()}
                                                                            index={
                                                                                index
                                                                            }
                                                                        >
                                                                            {(
                                                                                provided
                                                                            ) => (
                                                                                <div
                                                                                    ref={
                                                                                        provided.innerRef
                                                                                    }
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                >
                                                                                    <Cardtickes
                                                                                        key={
                                                                                            ticket.id
                                                                                        }
                                                                                        tickets={
                                                                                            ticket
                                                                                        }
                                                                                        fetchticketsData={
                                                                                            fetchUsersData
                                                                                        }
                                                                                        selectedProject={
                                                                                            selectedProject
                                                                                        }
                                                                                        modifuy={
                                                                                            modifuy
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    )
                                                                )
                                                            ) : (
                                                                <p>
                                                                    No tickets
                                                                    found.
                                                                </p>
                                                            )}
                                                            {
                                                                provided.placeholder
                                                            }{" "}
                                                            {/* Include the placeholder */}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            )}
                                            {shouldShowAddButton && (
                                                <div className="h-[50px] flex mt-8 first-letter pb-10 justify-between items-center">
                                                    {!inProgressForm && (
                                                        <button
                                                            className="h-[50px] flex-1 flex first-letter text-2xl pl-10 pr-10 p-10 justify-start items-center border border-gray-300 rounded-md hover:border-blue-500"
                                                            onClick={
                                                                handleCreateTicketInProgress
                                                            }
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="30"
                                                                height="30"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                className="mr-2"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                                />
                                                            </svg>
                                                            Crée tickets
                                                        </button>
                                                    )}
                                                    {inProgressForm && (
                                                        <form
                                                            onSubmit={
                                                                handleSubmitTicketInProgress
                                                            }
                                                            className="flex items-start justify-center flex-1"
                                                        >
                                                            <input
                                                                type="text"
                                                                value={
                                                                    ticketNameInProgress
                                                                }
                                                                onChange={(e) =>
                                                                    setTicketNameInProgress(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Enter ticket name"
                                                                className="p-2 m-2 border  border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                                                            />
                                                            <button
                                                                type="submit"
                                                                className=" flex first-letter text-2xl h-[40px] mt-2  justify-start items-center border border-gray-300 rounded-md hover:border-blue-500"
                                                            >
                                                                Create Ticket
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-[300px] flex flex-col justify-between bg-gray-100 rounded-xl shadow-2xl">
                                            <div className="h-[50px] flex first-letter pl-10 pr-10 p-10 justify-between bg-green-400 items-center">
                                                <h1 className="text-2xl">
                                                    Fini
                                                </h1>
                                            </div>
                                            {loading ? (
                                                <p>Loading..</p>
                                            ) : (
                                                <Droppable
                                                    droppableId="Fini"
                                                    isDropDisabled={
                                                        !shouldEnableDragDrop
                                                    }
                                                >
                                                    {(provided) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            className="flex-1 max-h-[800px] flex flex-col gap-5 p-8 overflow-auto"
                                                        >
                                                            {loading ? (
                                                                <p>
                                                                    Loading...
                                                                </p>
                                                            ) : tickets.done
                                                                  .length ? (
                                                                tickets.done.map(
                                                                    (
                                                                        ticket,
                                                                        index
                                                                    ) => (
                                                                        <Draggable
                                                                            key={
                                                                                ticket.id
                                                                            }
                                                                            draggableId={ticket.id.toString()}
                                                                            index={
                                                                                index
                                                                            }
                                                                        >
                                                                            {(
                                                                                provided
                                                                            ) => (
                                                                                <div
                                                                                    ref={
                                                                                        provided.innerRef
                                                                                    }
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                >
                                                                                    <Cardtickes
                                                                                        key={
                                                                                            ticket.id
                                                                                        }
                                                                                        tickets={
                                                                                            ticket
                                                                                        }
                                                                                        fetchticketsData={
                                                                                            fetchUsersData
                                                                                        }
                                                                                        selectedProject={
                                                                                            selectedProject
                                                                                        }
                                                                                        modifuy={
                                                                                            modifuy
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    )
                                                                )
                                                            ) : (
                                                                <p>
                                                                    No tickets
                                                                    found.
                                                                </p>
                                                            )}
                                                            {
                                                                provided.placeholder
                                                            }{" "}
                                                            {/* Include the placeholder */}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            )}
                                            {shouldShowAddButton && (
                                                <div className="h-[50px] flex mt-8  first-letter pb-10 justify-between items-center">
                                                    {!doneForm && (
                                                        <button
                                                            className="h-[50px] flex-1 flex first-letter text-2xl pl-10 pr-10 p-10 justify-start items-center border border-gray-300 rounded-md hover:border-blue-500"
                                                            onClick={
                                                                handleCreateTicketDone
                                                            }
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="30"
                                                                height="30"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                className="mr-2"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                                />
                                                            </svg>
                                                            Crée tickets
                                                        </button>
                                                    )}
                                                    {doneForm && (
                                                        <form
                                                            onSubmit={
                                                                handleSubmitTicketDone
                                                            }
                                                            className="flex items-start justify-center flex-1"
                                                        >
                                                            <input
                                                                type="text"
                                                                value={
                                                                    ticketNameDone
                                                                }
                                                                onChange={(e) =>
                                                                    setTicketNameDone(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Enter ticket name"
                                                                className="p-2 m-2 border  border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                                                            />
                                                            <button
                                                                type="submit"
                                                                className=" flex first-letter text-2xl h-[40px] mt-2  justify-start items-center border border-gray-300 rounded-md hover:border-blue-500"
                                                            >
                                                                Create Ticket
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {showSprints && (
                                        <button
                                            className={`my-button ${
                                                showAdditionalContent
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setShowAdditionalContent(
                                                    !showAdditionalContent
                                                )
                                            }
                                        >
                                            <div className="circle">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                </svg>
                                            </div>
                                        </button>
                                    )}
                                    <CSSTransition
                                        in={showAdditionalContent}
                                        timeout={300}
                                        classNames="slide"
                                        unmountOnExit
                                    >
                                        <Sprints
                                            projectid={selectedProject}
                                            shouldEnableDragDropSprints={
                                                shouldEnableDragDropSprints
                                            }
                                        />
                                    </CSSTransition>
                                </div>
                            </div>
                        </DragDropContext>
                    )}
                </>
            ) : (
                <div className="flex-1 text-[20px] font-bold flex justify-center items-center">
                    <p>Content to display not available</p>
                </div>
            )}
        </>
    );
};

export default Tickets;
