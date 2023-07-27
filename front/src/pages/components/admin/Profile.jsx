import { useEffect, useState } from "react";
import axiosClient from "../../../axios";
import Rolemodels from "../../model/Rolemodels";

export default function Profile() {
    const [Roles, setRoles] = useState([]);
    const [privileges, setprivileges] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [privilegeSettings, setPrivilegeSettings] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(true); // Add loading state
    const [groupedPrivileges, setGroupedPrivileges] = useState({}); // Add groupedPrivileges state
    const [loadingPrivileges, setLoadingPrivileges] = useState(true); // Add loading state for privileges

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        // Check if data exists in session storage when the component mounts
        const storedPrivileges = sessionStorage.getItem("privileges");
        const storedRoles = sessionStorage.getItem("roles");
    
        if (storedPrivileges && storedRoles) {
          // If data exists in session storage, parse it and set the state
          setprivileges(JSON.parse(storedPrivileges));
          setLoadingPrivileges(false);
          setRoles(JSON.parse(storedRoles));
          setLoadingRoles(false);
        } else {
          // If data doesn't exist in session storage, fetch it from the API
          fetchData();
        }
      }, []);
    
      const fetchData = async () => {
        try {
          const privilegesResponse = await axiosClient.get("privileges");
          setprivileges(privilegesResponse.data);
          setLoadingPrivileges(false);
          // Save the fetched privileges data to session storage
          sessionStorage.setItem("privileges", JSON.stringify(privilegesResponse.data));
          const rolesResponse = await axiosClient.get("profiles");
          setRoles(rolesResponse.data);
          setLoadingRoles(false);
          sessionStorage.setItem("roles", JSON.stringify(rolesResponse.data));
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoadingPrivileges(false);
          setLoadingRoles(false);
        }
      };
    


    const handleViewPrivileges = (role) => {
        setSelectedRole(role);
        axiosClient
            .get(`profiless/${role.id}/privileges`)
            .then((response) => {
                const privilegeIds = response.data.map(
                    (privilege) => privilege.id
                );
                const privilegeSettings = {};
                privilegeIds.forEach((id) => {
                    privilegeSettings[id] = true;
                });
                setPrivilegeSettings(privilegeSettings);
            })
            .catch((error) => {
                console.error("Error fetching privileges:", error);
            });
    };

    const handlePrivilegeCheckboxChange = (privilegeId, checked) => {
        setPrivilegeSettings((prevState) => ({
            ...prevState,
            [privilegeId]: checked,
        }));

        const payload = { privileges: privilegeId };

        const endpoint = checked
            ? `profiless/${selectedRole.id}/attach-privileges`
            : `profiless/${selectedRole.id}/detach-privileges`;

        axiosClient
            .post(endpoint, payload)
            // eslint-disable-next-line no-unused-vars
            .then((response) => {})
            .catch((error) => {
                console.error(
                    `Error ${checked ? "adding" : "deleting"} privilege:`,
                    error
                );
            });
    };

    const groupPrivilegesByStatusId = () => {
        const groupedPrivileges = {};
        const promises = privileges.map((privilege) =>
            axiosClient.get(`statuses/${privilege.status_id}`)
        );

        // Wait for all promises to resolve
        Promise.all(promises)
            .then((responses) => {
                responses.forEach((response, index) => {
                    const statusName = response.data.name;
                    const privilege = privileges[index];

                    if (!groupedPrivileges[statusName]) {
                        groupedPrivileges[statusName] = [];
                    }
                    groupedPrivileges[statusName].push(privilege);
                });

                // Set the state with the grouped privileges
                setGroupedPrivileges(groupedPrivileges);
            })
            .catch((error) => {
                console.error("Error fetching status details:", error);
            });
    };
    
    useEffect(() => {
        // Call the function to group privileges by statusId when privileges change
        groupPrivilegesByStatusId();
    }, [privileges]);

    return (
        <div className="flex-1 flex sm:flex-col lg:flex-row md:flex-row">
            <div className=" m-10 rounded-xl shadow-xl bg-gray-100 flex flex-col">
                <h1 className="text-[30px] mt-10 ml-10">Roles & Privilages</h1>
                <div className="flex justify-end items-end mr-12">
                    <button
                        type="button"
                        className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-blue-900 to-voilet-500 sm:ml-auto shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                        onClick={handleShowModal}
                    >
                        <svg
                            className="mr-2 -ml-1 w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"></path>
                        </svg>
                        Add Role
                    </button>
                </div>
                <div className="flex-1 mt-12">
                    <div className=" mx-auto">
                        <div className="bg-white shadow-md rounded my-6">
                            {loadingRoles ? (
                                <div className="flex-1 flex justify-center items-center">
                                    <div className=" w-16 h-16 border-4 border-t-transparent border-red-400 border-double rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <table className="text-left w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                                                Roles
                                            </th>
                                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Roles.map((role) => (
                                            <tr
                                                className="hover:bg-grey-lighter"
                                                key={role.id}
                                            >
                                                <td className="py-4 px-6 border-b border-grey-light  font-bold text-xl">
                                                    {role.name}
                                                </td>
                                                <td className="py-4 px-6 border-b border-grey-light flex gap-3">
                                                    <button
                                                        onClick={() =>
                                                            handleViewPrivileges(
                                                                role
                                                            )
                                                        }
                                                        className="bg-blue-500 text-white hover:text-black font-bold py-1 px-3 rounded text-xs hover:bg-blue-200"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {selectedRole && (
                <div className="flex-1 mt-10 mb-10 shadow-xl rounded-xl flex flex-col">
                    <h1 className="text-[30px] mt-10 ml-10">
                        Privilages - {selectedRole.name}
                    </h1>
                    <div className="flex-1 m-24 ml-[20%] mr-[20%] justify-center">
                        {loadingPrivileges ? (
                            <div className="flex-1 flex justify-center items-center">
                                <div className=" w-16 h-16 border-4 border-t-transparent border-red-400 border-double rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-10">
                                {Object.entries(groupedPrivileges).map(
                                    ([statusId, privilegesGroup]) => (
                                        <div
                                            key={statusId}
                                            className="flex-1 mt-10 mb-10 shadow-xl rounded-xl flex flex-col"
                                        >
                                            <h1 className="text-[30px] mt-10 ml-10">
                                                Privilages - {statusId}
                                            </h1>
                                            <div className="flex-1 m-24 ml-[20%] mr-[20%] justify-center">
                                                <div className="grid grid-rows-2 gap-10">
                                                    {privilegesGroup.map(
                                                        (privilege) => (
                                                            <div
                                                                className="bg-gray-600 p-4 border flex justify-between rounded-2xl shadow-2xl"
                                                                key={
                                                                    privilege.id
                                                                }
                                                            >
                                                                <div className="font-bold text-xl">
                                                                    {
                                                                        privilege.name
                                                                    }
                                                                </div>
                                                                <div className="flex gap-3 items-center">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                privilegeSettings[
                                                                                    privilege
                                                                                        .id
                                                                                ] ||
                                                                                false
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handlePrivilegeCheckboxChange(
                                                                                    privilege.id,
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                )
                                                                            }
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {showModal && <Rolemodels onCloseModal={handleCloseModal}  fetchData={fetchData} />}
        </div>
    );
}
