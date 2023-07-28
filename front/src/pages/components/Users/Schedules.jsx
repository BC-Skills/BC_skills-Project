import React, { useState, useEffect } from 'react';
import ScheduleForm from '../../model/ScheduleForm';
import { useStateContext } from "../../../contexts/contextProvider";
import axiosClient from "../../../axios";

const ScheduleTable = () => {
  const [schedules, setSchedules] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useStateContext();

  useEffect(() => {
    // Fetch data from the API using Axios
    axiosClient.get(`schedules/user/${currentUser.id}`)
    .then((response) => {
      setSchedules(response.data);
    })
    .catch((error) => {
      console.error('Error fetching schedules:', error);
    });

    // Fetch tickets
    axiosClient.get('tickets/')
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
      });

    // Fetch projects
    axiosClient.get('projects/')
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  const handleAddSchedule = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFileDownload = (id, fileName) => {
    axiosClient
      .get(`schedules/download/${id}`, {
        responseType: 'blob',
      })
      .then((response) => {
        // Create a blob from the response data
        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        // Create a download link for the blob
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);

        // Simulate a click on the link to trigger the download
        downloadLink.click();

        // Remove the temporary download link
        document.body.removeChild(downloadLink);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  
    }

  // Group schedules by date
  const schedulesByDate = schedules.reduce((acc, schedule) => {
    const date = schedule.date.split('T')[0]; // Remove the time part from the date
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(schedule);
    return acc;
  }, {});

  return (
    <div>
      <button
            onClick={handleAddSchedule}
            className="bg-[#41415A] hover:bg-[#6C6D96] text-white font-bold py-2 px-4 rounded ml-6 mt-4"
          >
            Add Schedule
          </button>

      {Object.entries(schedulesByDate).map(([date, schedulesForDate]) => (
        <div key={date} className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
          <h1 className="text-2xl font-bold mb-4 px-6 py-4 bg-gray-50">Schedule Table for {date}</h1>
          
          <table className="w-full mt-4 border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Start Hour
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  End Hour
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Ticket Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Project Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Description
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  File
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {schedulesForDate.map((schedule) => {
                const ticket = tickets.find((ticket) => ticket.id === schedule.ticket_id);
                const project = projects.find((project) => project.id === schedule.project_id);

                return (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b border-gray-200">{schedule.date}</td>
                    <td className="px-6 py-4 border-b border-gray-200">{schedule.start_hour}</td>
      
                    <td className="px-6 py-4 border-b border-gray-200">{schedule.end_hour}</td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {ticket ? ticket.nom : '-'}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {project ? project.nom : '-'}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">{schedule.description}</td>
                    
                    <td className="px-6 py-4 border-b border-gray-200">
                      {schedule.file_path ? (
                        <div>
                          <p>File Name: {schedule.file_name}</p>
                          <button onClick={() => handleFileDownload(schedule.id, schedule.file_name)}>
                            Download File
                          </button>
                        </div>
                      ) : (
                        <p>No File Uploaded</p>
                      )}
                    </td>

                    <td className="px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-end gap-4">
                        {/* ... (existing code for the delete and edit buttons remains unchanged) */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {showForm && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            {showForm && <ScheduleForm onClose={handleFormClose} userId={currentUser.id} />}
            <button
              onClick={handleFormClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;
