/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import ScheduleForm from '../../model/ScheduleForm';
import { useStateContext } from '../../../contexts/contextProvider';
import axiosClient from '../../../axios';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Transition } from '@headlessui/react';

const ScheduleTable = () => {
  const [schedules, setSchedules] = useState([]);
  const [scheduless, setScheduless] = useState([]);

  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { profile, currentUser } = useStateContext();
  

  const [searchDate, setSearchDate] = useState('');
  const [searchProject, setSearchProject] = useState('');
  const [searchTicket, setSearchTicket] = useState('');
  const [searchOption, setSearchOption] = useState('date');

  const [filteredSchedulesByDate, setFilteredSchedulesByDate] = useState({});
  const [currentDate] = useState(new Date().toISOString().slice(0, 10));
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);

  useEffect(() => {
    fetchsechu(currentUser, searchDate, searchProject, searchTicket);
  }, [currentUser, searchDate, searchProject, searchTicket]);
  
  const fetchsechu = async (currentUser, searchDate, searchProject, searchTicket) => {
    try {
      // Fetch schedules
      const schedulesResponse = await axiosClient.get(`scheduless/last-7-days/${currentUser.id}`);
      const schedulesData = schedulesResponse.data;
      setSchedules(schedulesData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

 useEffect(() => {
  // Check if schedules has data
  if (schedules) {

  console.log(schedules)

    const filteredSchedules = schedules.filter((schedule) => {
      const dateMatch = schedule.date.toLowerCase().includes(searchDate.toLowerCase());
      const ticket = tickets.find((ticket) => ticket.id === schedule.ticket_id);
      const project = projects.find((project) => project.id === schedule.project_id);
      const projectMatch = project ? project.nom.toLowerCase().includes(searchProject.toLowerCase()) : true;
      const ticketMatch = ticket ? ticket.nom.toLowerCase().includes(searchTicket.toLowerCase()) : true;
      return dateMatch && projectMatch && ticketMatch;
    });
    const filteredSchedulesByDate = filteredSchedules.reduce((acc, schedule) => {
      const date = schedule.date.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(schedule);
      return acc;
    }, {});
    const uniqueDates = Object.keys(filteredSchedulesByDate).sort((a, b) => new Date(a) - new Date(b));

    setFilteredSchedulesByDate(filteredSchedulesByDate);
    
  }

  // Fetch tickets, projects, and scheduless data
  
}, [schedules, searchDate, searchProject, searchTicket]);



  useEffect(() => {
    if (searchDate || searchProject || searchTicket) {

      axiosClient
      .get(`schedules/user/${currentUser.id}`)
      .then((response) => {
        setSchedules(response.data);
        setIsLoadingSchedules(false);
        //schedules/user/${currentUser.id}

        const schedulesByDate = response.data.reduce((acc, schedule) => {
          const date = schedule.date.split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(schedule);
          return acc;
        }, {});

        const filteredSchedules = response.data.filter((schedule) => {
          const dateMatch = schedule.date.toLowerCase().includes(searchDate.toLowerCase());
          const ticket = tickets.find((ticket) => ticket.id === schedule.ticket_id);
          const project = projects.find((project) => project.id === schedule.project_id);
          const projectMatch = project ? project.nom.toLowerCase().includes(searchProject.toLowerCase()) : true;
          const ticketMatch = ticket ? ticket.nom.toLowerCase().includes(searchTicket.toLowerCase()) : true;
          return dateMatch && projectMatch && ticketMatch;
        });

        const filteredSchedulesByDate = filteredSchedules.reduce((acc, schedule) => {
          const date = schedule.date.split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(schedule);
          return acc;
        }, {});

        const uniqueDates = Object.keys(filteredSchedulesByDate).sort((a, b) => new Date(a) - new Date(b));

        setFilteredSchedulesByDate(filteredSchedulesByDate);
        // eslint-disable-next-line no-undef
        setUniqueDates(uniqueDates);
      })
      .catch((error) => {
        console.error('Error fetching schedules:', error);
        setIsLoadingSchedules(false);
      });

    axiosClient
      .get('tickets/')
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
      });

    axiosClient
      .get('projects/')
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);

      });

      axiosClient
      .get('schedules/')
      .then((response) => {
        setScheduless(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
      });

    }
    
  }, [currentUser.id, searchDate, searchProject, searchTicket]);

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
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  const handleSearch = (searchValue) => {
    if (searchOption === 'date') {
      console.log(searchValue);
      setSearchDate(searchValue);
    } else if (searchOption === 'project') {
      setSearchProject(searchValue);
    } else if (searchOption === 'ticket') {
      setSearchTicket(searchValue);
    }
  };

  const allSchedules = Object.values(filteredSchedulesByDate).reduce((acc, schedules) => [...acc, ...schedules], []);
  const paginatedSchedules = [];
  for (let i = 0; i < allSchedules.length; i += 7) {
    paginatedSchedules.push(allSchedules.slice(i, i + 7));
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-row-reverse items-center justify-between">
        <div className="flex flex-row gap-6 justify-center items-center">
          <div className="flex-1">
            <h1 className="text-[20px] font-bold">{currentUser.name}</h1>
            <h1 className="text-[15px] font-bold text-blue-400">{profile.name}</h1>
          </div>
          <div className="user">
            <img className="flex-1" src={currentUser.profile_picture} alt="Profile Picture" />
          </div>
        </div>
        <div className="flex justify-center items-center mt-4 space-x-4">
          {searchOption === 'date' ? (
            <div className="relative">
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg w-48 focus:outline-none focus:border-blue-500"
                value={searchDate}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder={`Search by ${searchOption}`}
                className="px-4 py-2 border border-gray-300 rounded-lg w-48 focus:outline-none focus:border-blue-500"
                value={searchOption === 'project' ? searchProject : searchTicket}
                onChange={(e) => handleSearch(e.target.value)}
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
          )}
          <div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
            >
              <option value="date">Search by Date</option>
              <option value="project">Search by Project</option>
              <option value="ticket">Search by Ticket</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleAddSchedule}
          className="bg-[#41415A] hover:bg-[#6C6D96] text-white font-bold py-2 px-4 rounded ml-6 mt-4"
        >
          Add Schedule
        </button>
      </div>

      <div className="w-full">
        {Object.entries(filteredSchedulesByDate)
          .reverse()
          .map(([date, schedulesForDate]) => {
            const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <div key={date} className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                <h1 className="text-3xl font-bold mb-4 px-6 py-4 bg-gray-50 text-center text-[#41415A]">
                  {formattedDate.toUpperCase()}
                </h1>
                <table className="w-full mt-4 border-collapse bg-white text-left text-sm text-gray-600">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                        De
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                        A
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                        Ticket
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                        Projet
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                        Fichier
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 border-t border-gray-100">
 
    {schedulesForDate.map((schedule) => {
    

      return (
        <tr key={schedule.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 border-b border-gray-200">{schedule.date}</td>
          <td className="px-6 py-4 border-b border-gray-200">{schedule.start_hour}</td>
          <td className="px-6 py-4 border-b border-gray-200">{schedule.end_hour}</td>
          <td className="px-6 py-4 border-b border-gray-200">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF9300] px-2 py-1 text-xs font-semibold text-white">
              {schedule.ticket.nom}
            </span>
          </td>
          <td className="px-6 py-4 border-b border-gray-200">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0096FF] px-2 py-1 text-xs font-semibold text-white">
            {schedule.project.nom}
            </span>
          </td>
          <td className="px-6 py-4 border-b border-gray-200">{schedule.description}</td>
          <td className="px-6 py-4 border-b border-gray-200">
            {schedule.file_path ? (
              <div>
                <button className="bg-[#9437FF] hover:bg-[#B779FF] text-white font-bold py-1 px-2 rounded" onClick={() => handleFileDownload(schedule.id, schedule.file_name)}>
                  Download File
                </button>
              </div>
            ) : (
              <p>No File Uploaded</p>
            )}
          </td>
        </tr>
      );
    })}

</tbody>

                </table>
              </div>
            );
          })}
      </div>
      <table id="table-to-export" className="hidden w-full mt-4 border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Date
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              De
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              A
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Ticket
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Projet
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Description
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              fichier
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {allSchedules.reverse().map((schedule) => {
            const ticket = tickets.find((ticket) => ticket.id === schedule.ticket_id);
            const project = projects.find((project) => project.id === schedule.project_id);

            return (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200">{schedule.date}</td>
                <td className="px-6 py-4 border-b border-gray-200">{schedule.start_hour}</td>
                <td className="px-6 py-4 border-b border-gray-200">{schedule.end_hour}</td>
                <td className="px-6 py-4 border-b border-gray-200">{ticket ? ticket.nom : '-'}</td>
                <td className="px-6 py-4 border-b border-gray-200">{project ? project.nom : '-'}</td>
                <td className="px-6 py-4 border-b border-gray-200">{schedule.description}</td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {schedule.file_path ? (
                    <div>
                      <button onClick={() => handleFileDownload(schedule.id, schedule.file_name)}>
                        Download File
                      </button>
                    </div>
                  ) : (
                    <p>No File Uploaded</p>
                  )}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-end gap-4">{/* ... (existing code for the delete and edit buttons remains unchanged) */}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Transition
        show={showForm}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {(ref) => (
          <div ref={ref} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-800">
              {showForm && <ScheduleForm onClose={handleFormClose} userId={currentUser.id} />}
              <button onClick={handleFormClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
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
      </Transition>
      <div className="flex justify-center items-center">
        <ReactHTMLTableToExcel
          id="excelButton"
          className="bg-[#107C41] hover:bg-[#5FA780] text-white font-bold py-2 px-4 rounded ml-6 mt-4"
          table="table-to-export"
          filename={`schedule_of_${currentUser.name}_${currentDate}`}
          sheet="schedule_table"
          buttonText="Export to Excel"
        />
      </div>
    </div>
  );
};

export default ScheduleTable;
