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
        projectManager: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            tel: PropTypes.string.isRequired,
            profile_picture: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default function Cards({ project, onEditProject }) {
    const handleEditClick = () => {
        onEditProject(project);
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
                            {project.projectManager?.name}
                        </h1>
                        <h1 className="text-[15px] font-bold">
                            Email: {project.projectManager?.email}
                        </h1>
                        <h1 className="text-[15px] font-bold">
                            tele : {project.projectManager?.tel}
                        </h1>
                    </div>
                    <div className="relative w-16 h-16">
                        <img
                            src={project.projectManager?.profile_picture}
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
                </div>
             
            </div>
        </div>
    );
}

// eslint-disable-next-line react/prop-types
export function Header({ withValue }) {
    return (
        <div className="h-[50px] gap-3 flex relative rounded-xl overflow-hidden bg-violet-300 shadow-md shadow-gray-400">
            <div
                className={`h-full flex justify-center items-center bg-violet-900 ${withValue}`}
            ></div>

            <div className="absolute text-white inset-0 flex items-center justify-center text-sm font-medium">
                <ion-icon
                    size="large"
                    name="checkmark-circle-outline"
                ></ion-icon>
                <h1 className="text-[25px] font-bold text-white">Start</h1>
                <h1 className="font-bold ml-11 text-[25px] text-red">13/17</h1>
            </div>
        </div>
    );
}
