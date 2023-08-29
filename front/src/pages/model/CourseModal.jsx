/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/contextProvider";

const CourseModal = ({ isOpen, formationType,formationTypeid, onClose , fecthformtiontype, selectedformationTypen , selectetotal}) => {
    const [showInputs, setShowInputs] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        file: null,
    });

   
    const { currentUser } = useStateContext();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            file: e.target.files[0],
        }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const requestData = {
    //             name: formData.name,
    //             description: formData.description,
    //             formation_type_id: formationTypeid, // formationTypeId doesn't exist
    //           };
              
    //       console.log(requestData)
    //       console.log(formationTypeid)
      
    //       const response = await axiosClient.post(
    //         "formations",
    //         requestData,
    //         {
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //         }
    //       );
      
    //       onClose();
    //     } catch (error) {
    //       console.error("Error submitting formation:", error);
    //     }
    //   };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append( "duree",formData.duree);
            formDataToSend.append("description", formData.description);
            formDataToSend.append( "formation_type_id",formationTypeid);
            
            if (formData.file) {
                formDataToSend.append("file", formData.file);
            }
            fecthformtiontype()
            const response = await axiosClient.post(
                "formations",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            onClose();
        } catch (error) {
            console.error("Error submitting formation:", error);
        }
    };
      

    const handleDownload = async (formationId, fileName , dureee) => {
        
        try {
            const response = await axiosClient.get(
                `formations/${formationId}/download`
            );
            const payload = { formation_id: formationId ,
              duree:dureee
            };
          
            const response2 = await axiosClient.post(
                `usersss/${currentUser.id}/attachFormation`,payload
                );
                const payload2 = { name: selectedformationTypen ,
                    "user_id":currentUser.id
                            };
                console.log(payload2)
            if(response2.data===selectetotal){
                      
                    const response3= await axiosClient.post(`competences`,payload2,
                    {
                        responseType: "blob",
                    }
                    );
                }
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName); // Set the desired file name
            document.body.appendChild(link);
            link.click();
            link.remove();
            fecthformtiontype()
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };
    const handleDownload3 = async (formationId, fileName , dureee) => {
        try {
            const response = await axiosClient.get(
                `formations/${formationId}/download`,
                {
                    responseType: "blob",
                }
            );
            
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName); // Set the desired file name
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const filePicker = useRef(null);

    const [showDescriptions, setShowDescriptions] = useState({});

    const toggleDescription = (index) => {
        setShowDescriptions((prevShowDescriptions) => ({
            ...prevShowDescriptions,
            [index]: !prevShowDescriptions[index],
        }));
    };
//formations.users=currentuser
    return (
        <div className={`course-modal ${isOpen ? "visible" : "hidden"}`}>
            <div className={`flex modal-container man-w-[1000px] flex-col pb-2 bg-white m-h-${showInputs ? "full" : "[900px]"} md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto`}>
                <div className="flex justify-between mt-2 ml-2 mr-2">
                    <h1 className="text-[35px] font-bold">Formation</h1>
                    <button
                        onClick={onClose}
                        className="bg-[#3773ff] hover:bg-[#B779FF] text-white font-bold px-1 rounded"
                    >
                        Fermer
                    </button>
                </div>
                <div className="modal-content flex max-h-[500px]  flex-1 p-5 gap-3 overflow-y-auto">
    <div className="grid grid-cols-2 gap-4">
        {formationType?.map((formation, index) => (
            <div
                key={index}
                className={`flex flex-col p-4 shadow-md rounded-md ${
                    formation.users.some(user => user.id === currentUser.id) ? 'bg-green-100' : 'bg-gray-100'
                }`}
            >
    <h3 className="text-lg font-semibold">{formation.name}</h3>

    <h3 className="text-lg font-regular subpixel-antialiased">Duree : {formation.duree}h </h3>
    <p
      className={`text-gray-600 max-w-[300px] ${
        showDescriptions[index] ? 'block' : 'hidden'
      }`}
    >
      {formation.description}
    </p>
    <button
      className="mt-2 text-gray-600 underline"
      onClick={() => toggleDescription(index)}
    >
      {showDescriptions[index] ? 'Hide' : 'Show'} Description
    </button>
    <button
    className="mt-2 bg-[#9437FF] hover:bg-[#B779FF] text-white font-bold py-1 px-2 rounded"
    onClick={() => {
        if (formation.users.some(user => user.id === currentUser.id)) {
            handleDownload3(formation.id, formation.file_path, formation.duree, );
        } else {
            handleDownload(formation.id, formation.file_path, formation.duree);
        }
    }}
>
    Telecharger
</button>
  </div>
))}

                    </div>
                </div>
                <div className="modal-content flex h-[1OOpx] px-4 justify-center items-start border-[2px] p-1 border-black pb-4 ">
                    {showInputs ? (
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-center gap-24 flex-1">
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="name"
                                    >
                                        Nom:
                                    </label>
                                    <input
                                        type="text"
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                     <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="name"
                                    >
                                        duree:
                                    </label>
                                    <input
                                        type="number"
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="duree"
                                        name="duree"
                                        value={formData.duree}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2 mt-3"
                                        htmlFor="description"
                                    >
                                        Description:
                                    </label>
                                    <textarea
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                    ></textarea>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        hidden
                                        id="file"
                                        name="file"
                                        ref={filePicker}
                                    />
                                </div>
                                <div
                                    className="flex flex-col gap-3 text-black items-center justify-center"
                                    onClick={() => filePicker.current.click()}
                                >
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="file"
                                    >
                                        Fichier:
                                    </label>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-black cursor-pointer"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 3v4M12 21v-6M4 12h4M16 12h4M3 9a9 9 0 0114.55-7.746l-1.314 3.942A5.001 5.001 0 0020.9 12H17M7.243 4.243a5.001 5.001 0 00-3.864 12.728l3.942-1.314A9.007 9.007 0 013 9M3 21a9 9 0 009-9h4a5 5 0 011.759.316l2.472-2.472a9.01 9.01 0 00-12.213 2.29M21 3a9 9 0 00-9 9h4a5 5 0 01.316 1.759l2.472-2.472A9.01 9.01 0 0021 3z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex gap-6">
                            <button
                                onClick={handleSubmit}
                                className="bg-[#9437FF] flex-1 hover:bg-[#B779FF] text-white font-bold py-1 px-2 rounded"
                            >
                                Ajouter
                            </button>
                            <button
                                 onClick={() => setShowInputs(false)}
                                className="bg-[#9437FF] flex-1 hover:bg-[#B779FF] text-white font-bold py-1 px-2 rounded"
                            >
                                Annuler
                            </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowInputs(true)}
                            className="bg-[#9437FF] hover:bg-[#B779FF] flex-1 text-white font-bold py-1 px-2 rounded"
                        >
                            Ajouter un cours?
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseModal;