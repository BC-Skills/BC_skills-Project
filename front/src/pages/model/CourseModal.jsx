import { useRef, useState } from "react";

// eslint-disable-next-line react/prop-types
// eslint-disable-next-line react/prop-types
const CourseModal = ({ isOpen, formationType, onClose, onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            onFileUpload(selectedFile);
            setSelectedFile(null);
        }
    };

    const handleAddFormation = () => {
        setIsFormVisible(true);
    };
    const filePicker = useRef(null);

    return (
        <div className={`course-modal ${isOpen ? "visible" : "hidden"}`}>
            <div className="flex modal-container w-[1000px] flex-col pb-2 bg-white  h-[1000px] md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div className=" flex justify-between mt-2 ml-2 mr-2">
                    <h1 className="text-[35px] font-bold ">Formation</h1>
                    <button
                        onClick={onClose}
                        className="bg-[#3773ff] hover:bg-[#B779FF]  text-white font-bold  px-1 rounded"
                    >
                        Close
                    </button>
                </div>
                <div className="modal-content flex flex-col max-h-[800px] flex-1 p-5 gap-3 overflow-auto">
                    {formationType.map((course, index) => (
                        <div
                            key={index}
                            className="shadow-2xl p-2 items-center bg-gray-300 rounded-xl flex justify-between"
                        >
                            <div>{course.description}</div>
                            <button
                                className="bg-[#9437FF] hover:bg-[#B779FF] text-white font-bold py-1 px-2 rounded"
                                onClick={() =>
                                    handleFileDownload(
                                        schedule.id,
                                        schedule.file_name
                                    )
                                }
                            >
                                Download File
                            </button>
                        </div>
                    ))}
                </div>

                <div className="modal-content flex h-[1OOpx]  justify-center items-start">
                    {isFormVisible ? (
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-center gap-24 flex-1">
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
                                        // value={formData.description}
                                        // onChange={handleChange}
                                        rows="3"
                                        required
                                    ></textarea>
                                      <input
                                    type="file"
                                    onChange={handleFileChange}
                                    hidden
                                    ref={filePicker}
                                />
                              
                                </div>

                              
                                <div
                                    className="flex flex-col gap-3 text-black  items-center justify-center"
                                    onClick={() => filePicker.current.click()}
                                >
                                   <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="description"
                                    >
                                        file:
                                    </label>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-black cursor-pointer" // Adjust the height and width for the desired size
                                        fill="none"
                                        viewBox="0 0 256 256"
                                        xmlSpace="preserve"
                                    >
                                        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                                            <path
                                                style={{
                                                    stroke: "none",
                                                    strokeWidth: 1,
                                                    strokeDasharray: "none",
                                                    strokeLinecap: "butt",
                                                    strokeLinejoin: "miter",
                                                    strokeMiterlimit: 10,
                                                    fill: "rgb(0,0,0)",
                                                    fillRule: "nonzero",
                                                    opacity: 1,
                                                }}
                                                d="M 84.563 16.063 h -4.426 v -2.891 c 0 -2.634 -2.143 -4.776 -4.775 -4.776 H 71.53 v -3.62 C 71.53 2.143 69.388 0 66.754 0 H 5.437 C 2.803 0 0.661 2.143 0.661 4.776 v 73.637 C 0.661 84.802 5.859 90 12.248 90 h 67.187 c 5.461 0 9.904 -5.495 9.904 -12.249 V 20.84 C 89.339 18.206 87.196 16.063 84.563 16.063 z M 12.248 88 c -5.287 0 -9.587 -4.301 -9.587 -9.587 V 4.776 C 2.661 3.245 3.906 2 5.437 2 h 61.317 c 1.531 0 2.776 1.245 2.776 2.776 v 72.975 c 0 4.282 1.786 8.059 4.485 10.249 H 12.248 z M 87.339 77.751 c 0 5.651 -3.546 10.249 -7.904 10.249 s -7.904 -4.598 -7.904 -10.249 V 10.396 h 3.832 c 1.53 0 2.775 1.246 2.775 2.776 v 65.307 c 0 0.553 0.447 1 1 1 s 1 -0.447 1 -1 V 18.063 h 4.426 c 1.53 0 2.775 1.246 2.775 2.776 V 77.751 z"
                                                transform="matrix(1 0 0 1 0 0)"
                                                strokeLinecap="round"
                                            />
                                            {/* Other path elements go here */}
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <button
                                onClick={handleUpload}
                                className="bg-[#9437FF] flex-1 hover:bg-[#B779FF]  text-white font-bold py-1 px-2 rounded"
                            >
                                Upload
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddFormation}
                            className="bg-[#9437FF] hover:bg-[#B779FF] flex-1 text-white font-bold py-1 px-2 rounded"
                        >
                            Add Formation
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseModal;

// {formationType.map((course) => (
//   <li key={course.id}>
//     {course.name} - {course.description}
//   </li>
// ))}

// <button onClick={onClose}>Close</button>
