/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios";
import { useStateContext } from '../../../contexts/contextProvider';
import FormationTypeFormModal from "../../model/FormationTypeFormModal";
import CourseModal from "../../model/CourseModal"; // Update this import to match your file structure

export default function Formations() {
  const [formationTypes, setFormationTypes] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formationPerPage] = useState(6);
  const storedLinks = localStorage.getItem("links");
  const navigate = useNavigate();
  const { profile, currentUser } = useStateContext();
  const [showMore, setShowMore] = useState({});
  const [selectedFormationType, setSelectedFormationType] = useState(null);
  const [selectedFormationTypeid, setSelectedFormationTypeid] = useState(null);
  const [selectedformationTypen, setformationTypen] = useState(null);

  const [selectetotal, setselectetotal] = useState(null);




  const [shouldShowAddButton, setShouldShowAddButton] = useState(false);
  const [shouldEnableDragDrop, setShouldEnableDragDrop] = useState(true);

  useEffect(() => {
    const storedLinks = localStorage.getItem("links");
    const parsedLinks = JSON.parse(storedLinks) || [];
    const hasFormationLink = parsedLinks.some((link) => link.name === "formation");

    if (!hasFormationLink) {
        navigate("/users");
    } else {
        parsedLinks.forEach(link => {
            if (link.name === "projets") {
                const hasAddPrivilege = link.privilegeNames.includes("add");
                const hasEditPrivilege = link.privilegeNames.includes("edit");
                const shows = link.privilegeNames.includes("show");

                setShouldShowAddButton(hasAddPrivilege);
                setShouldEnableDragDrop(hasEditPrivilege);
             
            }
        });
    }
}, []);






  const fecthformtiontype=async ()=>{
     axiosClient.get("formation-types")
      .then(response => {
        setFormationTypes(response.data);
      })
      .catch(error => {
        console.error("Error fetching formation types:", error);
      });

  }

  const handleOpenFormModal = () => {
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleFormSubmit = () => {
    setIsFormModalOpen(false);
    try {
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const toggleShowMore = (id) => {
    setShowMore(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  
// In Formations component
const handleViewDetails = async (formationType, formationTypen) => {
  try {
    setformationTypen(formationTypen)
    setselectetotal(formationType.totalFormationDuration)
    setSelectedFormationType(formationType.formations); // Pass the courses array
    setSelectedFormationTypeid(formationType.id)
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

  
  


  const handleFileUpload = (file) => {
    console.log("Uploading file:", file);
  };

  const indexOfLastFormation = currentPage * formationPerPage;
  const indexOfFirstFormation = indexOfLastFormation - formationPerPage;
  const currentFormations = formationTypes
    .filter((formationType) =>
      formationType.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstFormation, indexOfLastFormation);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-row-reverse items-center justify-between mb-4">
        <div className="flex flex-row gap-6 justify-center items-center">
          <div className="flex-1">
            <h1 className="text-[20px] font-bold">{currentUser.name}</h1>
            <h1 className="text-[15px] font-bold text-blue-400">{profile.name}</h1>
          </div>
          <div className="user">
            <img className="flex-1  " src={currentUser.profile_picture} alt="Profile Picture" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search formations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-64 focus:outline-none focus:ring focus:border-primary"
          />
          <svg
            className="absolute top-3 right-3 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19l-4.35-4.35" />
          </svg>
        </div>
        {shouldShowAddButton && (
        <button
          onClick={handleOpenFormModal}
          className="bg-[#41415A] hover:bg-[#6C6D96] text-white font-bold py-2 px-4 rounded ml-6 mt-4 "
        >
          Ajouter une formation
        </button>
        )}
      </div>
      <div className=" flex-1 flex flex-row flex-wrap gap-12 items-center justify-center">
        {currentFormations.map((formationType, index) => (
          <div
            key={formationType.id}
            className={`bg-white rounded-lg overflow-hidden  mb-10 shadow-2xl max-w-[450px] min-h-[600px]  min-w-[500px]`} >
            <img src={formationType.imageUrl} alt="Formation Type" className="w-full h-full " />
            <div className="p-8 sm:p-9 md:p-7 xl:p-9 text-center">
              <h3 className="font-semibold text-dark text-xl mb-4 hover:text-primary">
                {formationType.name}
              </h3>
              <p className="text-base text-body-color leading-relaxed mb-7 ">
                {showMore[formationType.id]
                  ? formationType.description
                  : formationType.description.substring(0, 100) + "..."}
                <button
                  onClick={() => toggleShowMore(formationType.id)}
                  className="text-primary ml-1  text-[#41415A]"
                >
                  {showMore[formationType.id] ? "Show Less" : "Show More"}
                </button>
              </p>
              <button
                onClick={() => handleViewDetails(formationType, formationType.name)}
                className="inline-block py-2 px-7 border border-[#E5E7EB] rounded-full text-base text-body-color font-medium hover:border-primary hover:bg-primary hover:text-[#41415A] transition"
              >
                Cours
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <ul className="flex">
          {Array.from({ length: Math.ceil(formationTypes.length / formationPerPage) }, (_, index) => (
            <li key={index}>
              <button
                className={`px-3 py-2 mx-1 ${
                  index + 1 === currentPage
                    ? "bg-[#41415A] text-white"
                    : "bg-white text-gray-900 hover:bg-gray-300 hover:text-gray-700"
                } rounded-full focus:outline-none focus:ring focus:border-primary transition`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {isFormModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center  bg-gray-200 bg-opacity-50">
          <FormationTypeFormModal
            isOpen={isFormModalOpen}
            onClose={handleCloseFormModal}
            onFormSubmit={handleFormSubmit}
          />
        </div>
      )}
    {selectedFormationType && (
  <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
   <CourseModal
  isOpen={Boolean(selectedFormationType)}
  onClose={() => setSelectedFormationType(null)}
  formationType={selectedFormationType} // This is an array of formation objects
  formationTypeid={selectedFormationTypeid}
  onFileUpload={handleFileUpload}
  fecthformtiontype={fecthformtiontype}
  selectedformationTypen={selectedformationTypen}
  selectetotal={selectetotal}
  shouldShowAddButton={shouldShowAddButton}
/>

  </div>
)}

    </div>
  );
}