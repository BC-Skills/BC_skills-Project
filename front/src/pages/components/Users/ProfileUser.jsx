import React, { useState, useEffect } from 'react';
import { useStateContext } from '../../../contexts/contextProvider';
import axiosClient from '../../../axios';

const ProfilePage = () => {
  const { currentUser } = useStateContext();
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState(null); // State for the password update status
  const [profilePictureUrl, setProfilePictureUrl] = useState(currentUser.profilePictureUrl);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch the user's profile data based on their ID
    const fetchProfileData = async () => {
      try {
        const response = await axiosClient.get(`profile/${currentUser.id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [currentUser.id]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      // Send a request to the server to update the password
      const response = await axiosClient.post(`users/${currentUser.id}/update-password`, {
        newPassword: newPassword,
      });

      // Handle the response from the server (e.g., show a success message)
      setPasswordUpdateStatus('success'); // Set password update status to success
      console.log(response.data);
    } catch (error) {
      // Handle errors (e.g., display an error message)
      setPasswordUpdateStatus('error'); // Set password update status to error
      console.error('Error updating password:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Assuming the profile picture is uploaded to the server and you get a URL back
    // Update the profile picture URL state with the new URL
    setProfilePictureUrl(currentUser.profile_picture);
  };

  return (
    <div className="min-h-screen flex-1  bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center">
              <img
                className="w-24 h-24 object-cover rounded-full shadow-lg"
                src={currentUser.profile_picture}
                alt="Profile"
              />
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
                {/* <div className="flex justify-center">
                  <p>Created at : {currentUser.created_at}</p>
                </div> */}
              </div>
            </div>
            <div className="mt-10">
              <button
                onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Change Password
              </button>
              {/* Display password update status message */}
              {passwordUpdateStatus === 'success' && (
                <p className="text-green-500 mt-2">Password updated successfully!</p>
              )}
              {passwordUpdateStatus === 'error' && (
                <p className="text-red-500 mt-2">An error occurred while updating the password.</p>
              )}
              {showChangePasswordForm && (
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block font-bold mb-1">
                      New Password
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
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div className="mt-10">
              <div className="mb-4">
                <label htmlFor="profilePicture" className="block font-bold mb-1">
                  Profile Picture
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

export default ProfilePage;
