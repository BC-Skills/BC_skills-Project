/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';
import axiosClient from '../../axios';
import { useStateContext } from '../../contexts/contextProvider';


const ScheduleForm = ({ onClose, userId }) => {
  const [formData, setFormData] = useState({
    date: '',
    start_hour: '',
    end_hour: '',
    ticket_id: '',
    project_id: '',
    user_id: userId,
    file: null, 
    description: '', 
  });
  const {currentUser}=useStateContext();
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch projects and tickets data from the API
    const fetchProjectsAndTickets = async () => {
      try {
        const projectsResponse = await axiosClient.get(`/projects/${currentUser.id}/userss`);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjectsAndTickets();
  }, []);

  useEffect(() => {
    const fetchProjectsAndTickets = async () => {
      try {
        const ticketsResponse = await axiosClient.get(`ticketss/${formData.project_id}`);

        setTickets(ticketsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProjectsAndTickets()
  }, [formData.project_id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileName = file.name;

    setFormData((prevData) => ({
      ...prevData,
      file: file,
      file_name: fileName, 
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
      }
      );

      console.log(response.data); // Response from the server

      onClose();
    } catch (error) {
      console.error('Error submitting schedule:', error);
    }
    try {
      await axiosClient.put(`ticketss/${formData.ticket_id}`, {
          status: "En Cours",
      });
  } catch (error) {
      console.log("Error updating ticket status:", error);
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
            Heure debut
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
            Heure fin
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
          <label htmlFor="project_id" className="block font-bold mb-1">
            Nom Projet
          </label>
          <select
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="border border-gray-400 px-4 py-2 rounded w-full"
            required
          >
            <option value="">Selectionner un Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="ticket_id" className="block font-bold mb-1">
            Nom ticket
          </label>
          <select
            id="ticket_id"
            name="ticket_id"
            value={formData.ticket_id}
            onChange={handleChange}
            className="border border-gray-400 px-4 py-2 rounded w-full"
            required
          >
            <option value="">Selectionner Ticket</option>
            {tickets.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.nom}
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
            Fichier (PDF/Word)
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
            Annuler
          </button>
          <button
            type="submit"
            className="bg-[#41415A] hover:bg-[#6C6D96] text-white font-bold py-2 px-4 rounded ml-6 mt-4"
          >
            Add Schedule
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
