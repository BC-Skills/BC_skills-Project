import React, { useState } from "react";

// eslint-disable-next-line react/prop-types
const CourseModal = ({ isOpen, formationType, onClose, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className={`course-modal ${isOpen ? "visible" : "hidden"}`}>
        <div className=" flex modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
      <div className="modal-content">
        <h2>Courses</h2>
        <ul>
          {formationType.map((course) => (
            <li key={course.id}>
              {course.name} - {course.description}
            </li>
          ))}
        </ul>
        <h2>Upload New File</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <button onClick={onClose}>Close</button>
      </div>
      </div>
    </div>
  );
};

export default CourseModal;
