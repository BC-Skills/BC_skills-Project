import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios";
import { useStateContext } from '../../../contexts/contextProvider';
import FormationTypeFormModal from "../../model/FormationTypeFormModal";
import { API_URL } from '../../../config';

export default function Formations() {
  const [formationTypes, setFormationTypes] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const storedLinks = localStorage.getItem("links");
  const navigate = useNavigate();
  const { profile, currentUser } = useStateContext();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Function to toggle the description expansion
  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  useEffect(() => {
    const parsedLinks = JSON.parse(storedLinks) || [];
    const hasFormationLink = parsedLinks.some((link) => link.name === "formation");
    if (!hasFormationLink) {
      navigate("/users");
    }

    axiosClient.get("formation-types")
      .then(response => {
        setFormationTypes(response.data);
      })
      .catch(error => {
        console.error("Error fetching formation types:", error);
      });
  }, [storedLinks]);

  const handleOpenFormModal = () => {
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleFormSubmit = () => {
    setIsFormModalOpen(false);
    // Refresh or fetch updated formation types if needed
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-row-reverse items-center justify-between mb-4">
        <div className="flex flex-row gap-6 justify-center items-center">
          <div className="flex-1">
            <h1 className="text-[20px] font-bold">{currentUser.name}</h1>
            <h1 className="text-[15px] font-bold text-blue-400">{profile.name}</h1>
          </div>
          <div className="user">
            <img className="flex-1" src={currentUser.profile_picture} alt="Profile Picture" />
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
        <button
          onClick={handleOpenFormModal}
          className="bg-[#41415A] hover:bg-[#6C6D96] text-white font-bold py-2 px-4 rounded ml-6 mt-4"
        >
          Add Formation Type
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
        {formationTypes
          .filter((formationType) =>
            formationType.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((formationType) => (
            <div
              key={formationType.id}
              className="bg-white rounded-lg overflow-hidden mb-10 shadow-2xl"
            >
            <img
            src={formationType.imageUrl}
            alt="Formation Type"
            className="w-full"
          />

              <div className="p-8 sm:p-9 md:p-7 xl:p-9 text-center">
                <h3 className="font-semibold text-dark text-xl mb-4 hover:text-primary">
                  {formationType.name}
                </h3>
                <div className="mb-10">
                {isDescriptionExpanded ? (
                <p className="text-base text-body-color leading-relaxed mb-7">
                  {formationType.description}
                </p>
              ) : (
                <p className="text-base text-body-color leading-relaxed mb-7">
                  {formationType.description.split(" ").slice(0, 15).join(" ")}...
                </p>
              )}
               <button
                className="text-primary font-bold text-red-700"
                onClick={toggleDescription}
              >
                {isDescriptionExpanded ? "Show less" : "Read more"}
              </button>
              </div>
                <button
                  onClick={() => handleViewDetails(formationType)}
                  className="inline-block py-2 px-7 border border-[#E5E7EB] rounded-full text-base text-body-color font-medium hover:border-primary hover:bg-primary hover:text-white transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
      </div>
      {isFormModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
          <FormationTypeFormModal
            isOpen={isFormModalOpen}
            onClose={handleCloseFormModal}
            onFormSubmit={handleFormSubmit}
          />
        </div>
      )}
    </div>
  );
}
