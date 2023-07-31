import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Tickets = () => {
  const storedLinks = localStorage.getItem("links");
  const navigate = useNavigate();

  useEffect(() => {
    const parsedLinkss = JSON.parse(storedLinks) || [];
    const hasProjectsLink = parsedLinkss.some((link) => link.name === "tickets");
    if (!hasProjectsLink) {
      navigate("/users");
    }
  }, [storedLinks]);


 

    return (
      <div>
        <span className="text-sm">hey</span>
      </div>
    );
  };


export default Tickets;