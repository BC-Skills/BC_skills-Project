/* eslint-disable react/prop-types */
import PropTypes from "prop-types";

Cards.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nom: PropTypes.string.isRequired,
        duree: PropTypes.number.isRequired,
        client: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            tel: PropTypes.string.isRequired,
            profile_picture: PropTypes.string.isRequired,
        }).isRequired,
        project_manager: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            tel: PropTypes.string.isRequired,
            profile_picture: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default function Cards({ project, onEditProject,  AddCollaboratorProject , AddSprintsProject}) {


    const handleEditClick = () => {
        onEditProject(project);
      };

      const handleCollabora = () => {
        AddCollaboratorProject(project);
      };

      const handleSprint = () => {
        AddSprintsProject(project);
      };




    return (
        <div
            className="bg-[#ffffff] flex flex-col  p-4 rounded-lg shadow-lg shadow-gray-300"
            key={project.id}
        >
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-[30px] font-bold ">
                    {project.nom}
                </h1>
                <h1 className="text-[20px] font-bold ">
                    Durée : {project.duree} Mois
                </h1>
            </div>
            <div className="flex-1 flex flex-col gap-4">
                <div className=" flex-1 flex flex-row-reverse gap-2 items-center">
                    <div className="flex-1">
                        <h1 className="text-[20px] font-bold">
                            {project.client?.name}
                        </h1>
                        <h1 className="text-[15px]  text-neutral-500 dark:text-neutral-400">
                            Email: {project.client?.email}
                        </h1>
                        <h1 className="text-[15px] text-neutral-500 dark:text-neutral-400">
                            tele : {project.client?.tel}
                        </h1>
                    </div>
                    <div className="relative w-16 h-16">
                        <img
                            src={project.client?.profile_picture}
                            alt="Image"
                            className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div className="w-20 text-black font-bold">Client:</div>
                </div>
                <div className=" flex-1 flex flex-row-reverse gap-2 items-center">
                    <div className="flex-1">
                        <h1 className="text-[20px] font-bold">
                            {project.project_manager?.name}
                        </h1>
                        <h1 className="text-[15px] text-neutral-500 dark:text-neutral-400">
                            Email: {project.project_manager?.email}
                        </h1>
                        <h1 className="text-[15px] text-neutral-500 dark:text-neutral-400">
                            tel : {project.project_manager?.tel}
                        </h1>
                    </div>
                    <div className="relative w-16 h-16">
                        <img
                            src={project.project_manager?.profile_picture}
                            alt="Image"
                            className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div className="w-20 text-black font-bold">Manager:</div>
                </div>
                <div className="flex-1 flex justify-center items-center">
                <button className="rounded-lg ml-2 bg-[#41415A] px-5 py-3 hover:bg-[#6C6D96] text-base mb-3 font-medium text-white transition duration-200 "
                               onClick={() => handleEditClick(project)}
                       >
                        plus de Details
                    </button>
                    <button className="rounded-lg ml-2 bg-[#41415A] px-5 py-3 hover:bg-[#6C6D96] text-base mb-3 font-medium text-white transition duration-200 "
                               onClick={() => handleCollabora(project)}
                       >
                        Ajouter des collaborateurs
                    </button>
                     
                    <button className="rounded-lg ml-2 bg-[#41415A] px-5 py-3 hover:bg-[#6C6D96] text-base mb-3 font-medium text-white transition duration-200 "
                               onClick={() =>  handleSprint(project)}
                       >
                        Ajouter une phase
                    </button>

                   
                </div>
             
            </div>
        </div>
    );
}

