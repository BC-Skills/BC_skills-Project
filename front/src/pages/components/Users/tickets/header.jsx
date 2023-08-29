/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axiosClient from "../../../../axios";
import { useStateContext } from "../../../../contexts/contextProvider";

export default function Header({ onSelectProject , onSelectSprint ,onchangebutttonticket}) {
    const { currentUser, profile } = useStateContext();
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [sprints, setSprints] = useState([]);
    const [selectedSprintId, setSelectedSprintId] = useState("");

    const fetchProjectData = async () => {
        try {
            const response = await axiosClient.get(
                `projects/manager/${currentUser.id}`
            );
            const projectsData = response.data;
            setProjects(projectsData);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, []);

    useEffect(() => {
      if (selectedProjectId !== "") {
          fetchSprints(selectedProjectId);
      }
  }, [selectedProjectId]);
  

    const fetchSprints = async (projectId) => {
        try {
            const response = await axiosClient.get(`sprintss/${projectId}`);
            const sprintsData = response.data;
            setSprints(sprintsData);
        } catch (error) {
            console.error("Error fetching sprints:", error);
        }
    };

    const handleProjectChange = (event) => {
        const selectedProjectId = event.target.value;
        setSelectedProjectId(selectedProjectId);
        onSelectProject(selectedProjectId);
    };

    const handleSprintChange = (event) => {
      const selectedSprintId = event.target.value;
      setSelectedSprintId(selectedSprintId);
      onSelectSprint(selectedSprintId);
  };


    return (
        <div className="h-[100px] flex justify-between items-center">
            <div className="flex flex-1 justify-evenly items-center p-6 w-[50%]">
                <select
                    name="project_manager_id"
                    className="bg-gray-50 text-black text-[150%] rounded-2xl focus:ring-blue-500 focus:border-blue-500 block h-[100%] w-[30%] p-2.5 dark:bg-gray-100 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black shadow-2xl"
                    required
                    value={selectedProjectId}
                    onChange={handleProjectChange}
                >
                    <option value={null}>Selectionner un projet</option>
                    {projects.map((project) => (
                        <option value={project.id} key={project.id}>
                            {project.nom}
                        </option>
                    ))}
                </select>
                 <select
                    name="project_manager_id"
                    className="bg-gray-50 text-black text-[150%] rounded-2xl focus:ring-blue-500 focus:border-blue-500 block h-[100%] w-[30%] p-2.5 dark:bg-gray-100 dark:border-gray-100 dark:placeholder-gray-400 dark:text-black shadow-2xl"
                    required
                    value={selectedSprintId}
                    onChange={handleSprintChange} // Call handleSprintChange for sprint selection
                >
                    <option value="">Selectionner une phase</option>
                    {sprints.map((sprint) => (
                        <option value={sprint.id} key={sprint.id}>
                            {sprint.name}
                        </option>
                    ))}
                    <option value={'Without'}>Sans phase</option>
                </select>
                <button
                        type="button"
                        onClick={onchangebutttonticket}
                        className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-blue-600 to-voilet-500 sm:ml-auto shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                    >
                        Mes Taches
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
    );
}
