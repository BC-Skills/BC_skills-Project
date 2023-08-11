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
            className="bg-white flex flex-col  p-4 rounded-2xl shadow-2xl"
            key={project.id}
        >
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-[30px] font-bold font-serif">
                    {project.nom}
                </h1>
                <h1 className="text-[20px] font-bold font-serif">
                    Durre : {project.duree}/Months
                </h1>
            </div>
            <div className="flex-1 flex flex-col gap-4">
                <div className=" flex-1 flex flex-row-reverse gap-2 items-center">
                    <div className="flex-1">
                        <h1 className="text-[20px] font-bold">
                            {project.client?.name}
                        </h1>
                        <h1 className="text-[15px] font-bold">
                            Email: {project.client?.email}
                        </h1>
                        <h1 className="text-[15px] font-bold">
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
                        <h1 className="text-[15px] font-bold">
                            Email: {project.project_manager?.email}
                        </h1>
                        <h1 className="text-[15px] font-bold">
                            tele : {project.project_manager?.tel}
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
                       <button className="rounded-full bg-blue-500 px-5 py-3 text-base mb-3 font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700"
                               onClick={() => handleEditClick(project)}
                       >
                        More Details
                    </button>
                    <button className="rounded-full ml-2 bg-blue-500 px-5 py-3 text-base mb-3 font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700"
                               onClick={() => handleCollabora(project)}
                       >
                        Add Collaborator
                    </button>
                    <button className="rounded-full ml-2 bg-blue-500 px-5 py-3 text-base mb-3 font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700"
                               onClick={() =>  handleSprint(project)}
                       >
                        Add Sprints
                    </button>

                   
                </div>
             
            </div>
        </div>
    );
}

