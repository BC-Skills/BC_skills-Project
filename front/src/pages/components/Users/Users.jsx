// import React from 'react'

import { useEffect} from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const storedLinks = localStorage.getItem('links');
  const navigate = useNavigate();
  useEffect(() => {
      const parsedLinkss = JSON.parse(storedLinks) || [];
      const hasProjectsLink = parsedLinkss.some((link) => link.name === 'users');
      if (!hasProjectsLink) {
        navigate('/users');
      }
    }, [storedLinks]);
  


 
    
  return (
    <div className="flex-1 bg-black">
      
    </div>
  )
}
