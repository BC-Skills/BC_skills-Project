/* eslint-disable no-unused-vars */
import axiosClient from '../../axios';

// eslint-disable-next-line react/prop-types
export default function Rolemodels({ onCloseModal, fetchData }) {
    
   
    const handleAddRole = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
      
        const payload = {};
        formData.forEach((value, key) => {
          payload[key] = value;
        });
      
        try {
          // Send the data to the server using Axios
          const response = await axiosClient.post("profiles", payload);
      
          if (response.status === 200 || response.status === 201) {
            console.log("Employee added successfully!");
            event.target.reset();
            window.location.reload();
            sessionStorage.removeItem("roles"); // Remove "roles" from session storage
            await fetchData(); // Await fetchData here since it's an async function
          } else {
            console.error("Failed to add employee:", response.statusText);
          }
        } catch (error) {
          console.error("Error adding employee:", error);
        }
      };




    return (
        <>
            <div
                id="authentication-modal"
                aria-hidden="true"
                className="fixed ml-[35%] mt-[5%] z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div className="relative w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="px-6 py-6 lg:px-8">
            
                            <div className="flex items-center justify-between pb-3">
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                                Ajouter un role
                            </h3>
                                <button
                                    type="button"
                                    onClick={onCloseModal}
                                    data-modal-hide="edit-user-modal"
                                    className="text-white hover:text-gray-400 focus:outline-none"
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
                            <form
                                className="space-y-6"
                                action="#"
                                id="addEmployeeForm"
                                onSubmit={handleAddRole}
                            >
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="name"
                                        required
                                    />
                                </div>
                              
                              
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={onCloseModal}
                                        className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Ajouter
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        
            </div>
        </>
    );
}
