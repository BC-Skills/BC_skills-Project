import React, { useState } from "react";

// eslint-disable-next-line react/prop-types
const CourseModal = ({ isOpen, courses, onClose, onFileUpload }) => {
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
      <div className="modal-content">
        <h2>Courses</h2>
        <ul>
          {courses.map((course) => (
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
  );
};

export default CourseModal;
