import React, { useRef, useState } from "react";
import axiosClient from "../../axios";

const FormationTypeFormModal = ({ isOpen, onClose, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imagePath: null,
    });
    const filePicker = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            imagePath: file,
        }));

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        if (formData.imagePath) {
            formDataToSend.append("imagePath", formData.imagePath);
        }
        axiosClient
            .post("formation-types", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Formation type added:", response.data);
                onFormSubmit();
            })
            .catch((error) => {
                console.error("Error adding formation type:", error);
                if (error.response) {
                    console.log(
                        "Validation errors:",
                        error.response.data.errors
                    );
                }
            });
    };

    return (
        <div className={`modal ${isOpen ? "block" : "hidden"}`}>
            <div className=" flex modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div className="modal-content py-4 text-left px-6">
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">Add Formation Type</p>
                        <div
                            className="modal-close cursor-pointer z-50"
                            onClick={onClose}
                        >
                            <svg
                                className="fill-current text-black"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                            >
                                <path d="M1 1l16 16M17 1L1 17"></path>
                            </svg>
                        </div>
                    </div>
                    <form  onSubmit={handleSubmit}>
                        <div className="mb-4 p-10 ">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="name"
                            >
                                Name:
                            </label>
                            <input
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="description"
                            >
                                Description:
                            </label>
                            <textarea
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="description"
                                name="description"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-4">
                           
                            <div
                                className="flex gap-3 text-[#9CA3AF] flex-row items-center justify-center"
                                onClick={() => filePicker.current.click()}
                            >
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="description"
                            >
                                Image:
                            </label>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="42"
                                    height="42"
                                    fill="black"
                                    className="bi bi-camera-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                    <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                                </svg>
                            </div>
                            <input
                                hidden
                                ref={filePicker}
                                className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="imagePath"
                                name="imagePath"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        {previewImage && (
                            <div className="mb-4 max-w-[300px]">
                                <img
                                    src={previewImage}
                                    alt="Image Preview"
                                    className="max-w-full h-auto"
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-between mt-4">
                            <button
                                className="bg-[#41415A] hover:bg-[#6C6D96] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Add
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormationTypeFormModal;
