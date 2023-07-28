import React, { useState, useEffect } from 'react';
import axiosClient from '../../axios';

const ScheduleForm = ({ onClose, userId }) => {
  const [formData, setFormData] = useState({
    date: '',
    start_hour: '',
    end_hour: '',
    ticket_id: '',
    project_id: '',
    user_id: userId,
    file: null, // New field for the file
    description: '', // New field for the description
  });

  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch projects and tickets data from the API
    const fetchProjectsAndTickets = async () => {
      try {
        const projectsResponse = await axiosClient.get('projects');
        const ticketsResponse = await axiosClient.get('tickets');

        setProjects(projectsResponse.data);
        setTickets(ticketsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjectsAndTickets();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Extract only the filename without the fakepath
    const fileName = file.name;

    setFormData((prevData) => ({
      ...prevData,
      file: file,
      file_name: fileName, // Add the filename to the formData
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('date', formData.date);
      formDataToSend.append('start_hour', formData.start_hour);
      formDataToSend.append('end_hour', formData.end_hour);
      formDataToSend.append('ticket_id', formData.ticket_id);
      formDataToSend.append('project_id', formData.project_id);
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('description', formData.description); // Append the description field
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      const response = await axiosClient.post('schedules', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data); // Response from the server

      onClose();
    } catch (error) {
      console.error('Error submitting schedule:', error);
    }
  };

  return (
    <div className="bg-white p-1 rounded-lg ">
      <h2 className="text-lg font-bold mb-5">Add Schedule</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="date" className="block font-bold mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border border-gray-400 px-4 py-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="start_hour" className="block font-bold mb-1">
            Start Hour
          </label>
          <input
            type="time"
            id="start_hour"
            name="start_hour"
            value={formData.start_hour}
            onChange={handleChange}
            className="border border-gray-400 px-4 py-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="end_hour" className="block font-bold mb-1">
            End Hour
          </label>
          <input
            type="time"
            id="end_hour"
            name="end_hour"
            value={formData.end_hour}
            onChange={handleChange}
            className="border border-gray-400 px-4 py-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ticket_id" className="block font-bold mb-1">
            Ticket Name
          </label>
          <select
            id="ticket_id"
            name="ticket_id"
            value={formData.ticket_id}
            onChange={handleChange}
            className="border border-gray-400 px-4 py-2 rounded w-full"
            required
          >
            <option value="">Select Ticket</option>
            {tickets.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="project_id" className="block font-bold mb-1">
            Project Name
          </label>
          <select
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="border border-gray-400 px-4 py-2 rounded w-full"
            required
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-bold mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-400 px-4 py-2 rounded w-full"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="file" className="block font-bold mb-1">
            File (PDF/Word)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            className="border border-gray-400 px-4 py-2 rounded w-full"
            accept=".pdf,.doc,.docx"
            required
          />
        </div>
        <div className="text-right">
          <button type="button" onClick={onClose} className="text-gray-500 mr-2">
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Schedule
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
