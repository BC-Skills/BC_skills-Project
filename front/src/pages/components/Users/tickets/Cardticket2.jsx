import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";

export default function Cardticket2({ tick }) {
    const [flip, setFlip] = useState(false);

    const handleCardClick = () => {
        setFlip(!flip);
    };

    // Define a mapping of status values to background colors
    const statusColors = {
        "A faire": "bg-green-200",
        "En Cours": "bg-purple-200",
        Fini: "bg-blue-200",
    };

    return (
        <div className="mt-5 ml-5 max-h-[700px] max-w-[400px] min-h-[200px] min-w-[200px]">
            <ReactCardFlip
                key={tick.id}
                isFlipped={flip}
                flipDirection="horizontal"
            >
                <div
                    className={`flex items-center flex-col p-3 justify-center text-black rounded-xl shadow-2xl ${
                        statusColors[tick.status]
                    }`}
                >
                    <div className="p-4">
                        <h2 className="text-xl font-semibold">{tick.nom}</h2>
                        <p>Status: {tick.status}</p>
                        <p>qui m'a donner: {tick.user?.name}</p>
                    </div>
                    <button
                        className="bg-white w-[150px] p-[10px] text-[20px] font-bold rounded-lg"
                        onClick={handleCardClick}
                    >
                        More details
                    </button>
                </div>
                <div
                    className={`flex items-center flex-col p-3 justify-center text-black rounded-xl shadow-2xl ${
                        statusColors[tick.status]
                    }`}
                >
                    <div className="p-4">
                    <h2 className="text-xl font-semibold">project:{tick.project?.nom}</h2>
                        <p>{tick.project?.description}</p>
                        <h2 className="text-xl font-semibold">Sprint:{tick.sprint?.nom}</h2>
                        <p>{tick.sprint?.description}</p>

                    </div>
                    <button
                        className="bg-white w-[150px] p-[10px] text-[20px] font-bold rounded-lg"
                        onClick={handleCardClick}
                    >
                        More details
                    </button>
                </div>
            </ReactCardFlip>
        </div>
    );
}
