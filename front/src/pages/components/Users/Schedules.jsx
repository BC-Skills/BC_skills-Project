//import React from 'react'

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Schedules() {
  const storedLinks = localStorage.getItem('links');
  const navigate = useNavigate();

  
  useEffect(() => {
    const parsedLinkss = JSON.parse(storedLinks) || [];
    const hasProjectsLink = parsedLinkss.some((link) => link.name === 'schedules');
    console.log(parsedLinkss)
    if (!hasProjectsLink) {
      navigate('/users');
    }
  }, [storedLinks]);
  return (
    <div>
      Schedules
    </div>
  )
}
