import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

// Define PropTypes for the ContextProvider component
ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Create a React context with initial values
const StateContext = createContext({
  currentUser: {},
  userToken: null,
  setCurrentUser:{},
  setUserToken: () => {},
  setprofile:()=>{},
 
});


// Define the ContextProvider component
export function ContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const [profile, setprofile] = useState(() => {
    const storedprofile = localStorage.getItem("Profil");
    return storedprofile ? JSON.parse(storedprofile) : {};
  });
  const [userToken, setUserToken] = useState(localStorage.getItem('TOKEN') || '');
  
  
  const setUserTokenAndLocalStorage = (token) => {
    if (token) {
      localStorage.setItem('TOKEN', token);
    } else {
      localStorage.removeItem('TOKEN');
    }
    setUserToken(token);
  };

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("Profil", JSON.stringify(profile));
  }, [currentUser, profile]);

  return (
    <StateContext.Provider
      value={{ currentUser, setCurrentUser ,setprofile, profile, userToken, setUserToken: setUserTokenAndLocalStorage }}>
      {children}
    </StateContext.Provider>
  );
}

// Define the useStateContext hook
export function useStateContext() {
  return useContext(StateContext);
}
