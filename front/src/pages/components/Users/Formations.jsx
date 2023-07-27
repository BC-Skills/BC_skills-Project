//import React from 'react'

import { useEffect} from "react";
import { useNavigate } from "react-router-dom";

export default function Formations() {
  const storedLinks = localStorage.getItem('links');
  const navigate = useNavigate();

  
  useEffect(() => {
    const parsedLinkss = JSON.parse(storedLinks) || [];
    const hasProjectsLink = parsedLinkss.some((link) => link.name === 'formation');
    console.log(parsedLinkss)
    if (!hasProjectsLink) {
      navigate('/users');
    }
  }, [storedLinks]);
  return (
    <div>
      Formations
    </div>
  )
}
