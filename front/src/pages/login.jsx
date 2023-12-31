import { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';
import image from '../assets/images/image.png';
import image2 from '../assets/images/banner01.png';
import axiosClient from '../axios';
import { useStateContext } from '../contexts/contextProvider';
import {  useNavigate } from 'react-router-dom';
import AnimatedText from './anime';

export default function Login() {
  const { setCurrentUser, setprofile, setUserToken  } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Get the navigate function from useNavigate hook
  const [loginError, setLoginError] = useState(false);
  const { userToken, profile } = useStateContext();




  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = {
        email,
        password,
      };
      const response = await axiosClient.post('login', formData)
      setUserToken(response.data.token)
      setCurrentUser(response.data.user);
      setprofile(response.data.profile)
      setEmail('');
      setPassword('');
  
      if (response.data.error) {
        setLoginError(true); // Set loginError to true to display the error message
      } else {
        setLoginError(false); // Set loginError to false to hide the error message (if it was shown previously)
        if (response.data.profile.name === 'admin') {
          navigate("/dashboard"); 
        } else {
          navigate("/users"); 
        }
      }
    } catch (error) {
      setLoginError(true); // Set loginError to true to display the error message
      console.error(error);
    }
  };

  return (
    <div className="h-[90vh] w-full mt-10 overflow-hidden">
      <div className="bg-white p-10 w-full flex flex-row justify-evenly gap-10 rounded-b-lg">
        <div className="xl:flex-1 xl:p-10 xl:h-[80vh] flex xl:flex-row xl:overflow-hidden sm:hidden">
          <div className="flex flex-1 flex-col justify-center xl:ml-[150px] items-start">
            <h1 className="text-[40px] max-w-[500px] font-bold">
             BCSKILLS
            </h1>
            <div className="flex lg:flex-col xl:justify-center xl:items-start md:flex-col md:justify-center md:items-start">
              <h1 className="text-[30px]">Bienvenue chez BC Skills group </h1>
              
              <div className="flex-1 ">
                <img src={image2} className=" w-full h-full  object-contain  " alt="Logo" />
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-[550px] flex justify-around flex-col items-center h-[80vh] bg-slate-100 shadow-md rounded-lg p-10">
          <div className="h-[250px]">
            <img src={logo} className=" animate-pulse w-full h-full object-contain" alt="Logo" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-10 items-center">
          {loginError && (
        <p className="text-red-500 text-center mt-2">Email ou mot de passe incorrect</p>
      )}
            <input
              className="w-[400px] h-[70px] rounded-md shadow-md pl-10 placeholder:font-bold placeholder:text-black"
              type="email"
              placeholder="Email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="w-[400px] h-[70px] flex overflow-hidden flex-row justify-center items-center rounded-md shadow-md">
              <input
                className="flex-1 h-[100%] pl-10 placeholder:font-bold placeholder:text-black"
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="flex w-[80px] justify-center items-center overflow-hidden" id="togglePassword">
                <i className="far fa-eye"></i>
              </button>
            </div>
            <button className="w-[350px] h-[70px] bg-blue-500 rounded-xl shadow-xl" type="submit">
              Se connecter
            </button>
            <div className="flex flex-row items-center gap-5">
              <div className="h-[2px] w-[150px] bg-[#41415a]"></div>
              <h1 className="text-[20px] max-w-[500px] font-bold">Bc Skills</h1>
              <div className="h-[2px] w-[150px] bg-[#41415a]"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}