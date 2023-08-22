import React, { useState, useEffect } from 'react';

const AnimatedText = ({ text }) => {
  const [letters, setLetters] = useState([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1: forward, -1: backward

  const colorClasses = ['text-purple-300', 'text-blue-300', 'text-orange-300', 'text-green-300'];

  useEffect(() => {
    setLetters(text.split(''));
  }, [text]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentLetterIndex(currentLetterIndex + direction);
      
      if (currentLetterIndex === letters.length - 1) {
        setDirection(-1); // Switch direction to backward when reaching the end
      } else if (currentLetterIndex === 0) {
        setDirection(1); // Switch direction to forward when reaching the beginning
      }
    }, 100); // Adjust the delay as needed

    return () => clearTimeout(timeout);
  }, [currentLetterIndex, direction, letters]);

  return (
    <div className="text-center mt-10">
      <span className="text-[50px] inline-block">
        {letters.map((letter, index) => (
          <span key={index} className={`inline-block ${colorClasses[index % colorClasses.length]}`}>
            {index === 0 || index <= currentLetterIndex ? letter : '\u00A0'}
          </span>
        ))}
      </span>
    </div>
  );
};

export default AnimatedText;
