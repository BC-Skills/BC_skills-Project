import React, { useState } from 'react';
import { useStateContext } from '../../../contexts/contextProvider';
import axiosClient from '../../../axios';
import { Transition } from '@headlessui/react';

const Setting = () => {
  const { currentUser, profile } = useStateContext();
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post(`users/${currentUser.id}/update-password`, {
        newPassword: newPassword,
      });
      setPasswordUpdateStatus('success');
      console.log(response.data);
      setShowChangePasswordForm(false);
    } catch (error) {
      setPasswordUpdateStatus('error');
      console.error('Error updating password:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  };

  return (
    <div className="flex-1 bg-white-100 py-6 flex flex-col items-center justify-center sm:py-12">
      <div className="relative md:min-w-[700px] lg:min-w-[1000px] py-3">
        <div className="absolute inset-0 bg-gradient-to-r rounded-3xl overflow-hidden from-blue-400 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 rounded-3xl overflow-hidden bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center">
              <Transition
                show={true}
                enter="transition-opacity duration-1000"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <img
                  className="w-24 h-24 object-cover rounded-full shadow-lg"
                  src={currentUser.profile_picture}
                  alt="Profile"
                />
              </Transition>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex justify-center">
                  <h2 className="text-xl leading-6 font-medium text-gray-900">
                    {currentUser.name}
                  </h2>
                </div>
                <div className="flex justify-center">
                  <h2 className="text-xl leading-6 font-medium text-gray-900">
                    {profile && profile.name}
                  </h2>
                </div>
                <div className="flex justify-center">
                  <p>Email: {currentUser.email}</p>
                </div>
                <div className="flex justify-center">
                  <p>Tel: {currentUser.tel}</p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button
                onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                changer mot de passe
              </button>
              {passwordUpdateStatus === 'success' && (
                <p className="text-green-500 mt-2">Password updated successfully!</p>
              )}
              {passwordUpdateStatus === 'error' && (
                <p className="text-red-500 mt-2">An error occurred while updating the password.</p>
              )}
              <Transition
                show={showChangePasswordForm}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block font-bold mb-1">
                      nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border border-gray-400 px-4 py-2 rounded w-full"
                      required
                    />
                  </div>
                  <div className="text-right">
                    <button type="button" onClick={() => setShowChangePasswordForm(false)} className="text-gray-500 mr-2">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                      modifier mot de passe 
                    </button>
                  </div>
                </form>
              </Transition>
            </div>
            <div className="mt-10">
              <div className="mb-4">
                <label htmlFor="profilePicture" className="block font-bold mb-1">
                Image de profil
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  onChange={handleFileChange}
                  className="border border-gray-400 px-4 py-2 rounded w-full"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
