import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios";
import FormationTypeFormModal from "../../model/FormationTypeFormModal";

export default function Formations() {
  const [formationTypes, setFormationTypes] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const storedLinks = localStorage.getItem("links");
  const navigate = useNavigate();

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
      <section className="pt-20 lg:pt-[120px] pb-10 lg:pb-20 bg-[#FFFFFF] ">
        <div className="container">
          <button
            onClick={handleOpenFormModal}
            className="bg-[#41415A] hover:bg-[#6C6D96] text-white font-bold py-2 px-4 rounded ml-6 mt-4 "
          >
            Add Formation Type
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4 ">
            {formationTypes.map((formationType) => (
              <div
                key={formationType.id}
                className="bg-white rounded-lg overflow-hidden mb-10 shadow-2xl"
              >
                <img
                  src={formationType.imagePath}
                  alt="Formation Type"
                  className="w-full"
                />
                <div className="p-8 sm:p-9 md:p-7 xl:p-9 text-center">
                  <h3 className="font-semibold text-dark text-xl mb-4 hover:text-primary">
                    {formationType.name}
                  </h3>
                  <p className="text-base text-body-color leading-relaxed mb-7">
                    {formationType.description}
                  </p>
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
        </div>
      </section>
      {isFormModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200 bg-opacity-50 ">
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
