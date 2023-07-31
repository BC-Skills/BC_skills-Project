/* eslint-disable react/prop-types */
import PropTypes from "prop-types";

DetailsProject.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nom: PropTypes.string.isRequired,
        duree: PropTypes.number.isRequired,
    }).isRequired,
    onCloseModal: PropTypes.func.isRequired,
};

export default function DetailsProject({ project, onCloseModal }) {
    console.log(project);

    return (
        <>
            <div
                id="authentication-modal"
                aria-hidden="true"
                className="fixed ml-[25%] mt-[2%] z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div className="relative w-full max-w-[700px] bg max-h-full">
                    <div className="relative rounded-3xl shadow-2xl bg-gray-200">
                        <div className="px-6 py-6 lg:px-8">
                            <div className="flex items-center justify-between pb-3">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                                    Details
                                </h3>
                                <button
                                    type="button"
                                    onClick={onCloseModal}
                                    data-modal-hide="edit-user-modal"
                                    className="text-gray-500 hover:text-black focus:outline-none"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="m6 18 12-12M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-row justify-between items-center">
                                    <h1 className="text-[30px] font-bold font-serif">
                                        {project.nom}
                                    </h1>
                                    <h1 className="text-[20px] font-bold font-serif">
                                        Durre : {project.duree}/Months
                                    </h1>
                                </div>
                                <div className="flex-1 flex flex-row gap-4">
                                    <div className=" flex-1 flex flex-row-reverse  items-center">
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
                                                src={
                                                    project.client
                                                        ?.profile_picture
                                                }
                                                alt="Image"
                                                className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="w-20 text-black font-bold">
                                            Client:
                                        </div>
                                    </div>
                                    <div className=" flex-1 flex flex-row-reverse gap-2 items-center">
                                        <div className="flex-1">
                                            <h1 className="text-[20px] font-bold">
                                                {project.projectManager?.name}
                                            </h1>
                                            <h1 className="text-[15px] font-bold">
                                                Email:{" "}
                                                {project.projectManager?.email}
                                            </h1>
                                            <h1 className="text-[15px] font-bold">
                                                tele :{" "}
                                                {project.projectManager?.tel}
                                            </h1>
                                        </div>
                                        <div className="relative w-16 h-16">
                                            <img
                                                src={
                                                    project.projectManager
                                                        ?.profile_picture
                                                }
                                                alt="Image"
                                                className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="w-20 text-black font-bold">
                                            Manager:
                                        </div>
                                    </div>
                                </div>
                                <div>
                                        <p>{project.description}  </p>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}