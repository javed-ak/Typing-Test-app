import React, { useEffect, useRef, useState } from 'react';
import './style.css';

const paragraph = "As the golden sun dipped below the horizon, painting the sky with hues of orange and pink, the world seemed to pause for a moment. The gentle breeze rustled through the trees, carrying with it the scent of blooming jasmine. Somewhere in the distance, a bird's song echoed softly, blending seamlessly with the whispers of the wind. It was one of those rare, perfect evenings where everything felt in harmony, as if nature itself was taking a deep, contented breath. The tranquility of the moment wrapped around like a warm blanket, offering solace in the chaos of everyday life.";

const TypingTest = () => {
  const maxTime = 60;
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [mistakes, setMistakes] = useState(0);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);
  const inputRef = useRef();
  const charRef = useRef([]);
  const [correctWrong, setCorrectWrong] = useState([]);
  const [isTimeUp, setIsTimeUp] = useState(false); // New state to track if time's up

  useEffect(() => {
    inputRef.current.focus();
    setCorrectWrong(Array(paragraph.length).fill(''));
  }, []);

  useEffect(() => {
    let interval;
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);

        let correctChar = charIndex - mistakes;
        let totalTime = maxTime - timeLeft;

        let cpm = correctChar * (60 / totalTime);
        cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
        setCPM(parseInt(cpm, 10));

        let wpm = Math.round((correctChar / 5 / totalTime) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        setWPM(wpm);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsTyping(false);
      setIsTimeUp(true); // Set time up when time is 0
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTyping, timeLeft]);

  const resetAll = () => {
    setIsTyping(false);
    setTimeLeft(maxTime);
    setCharIndex(0);
    setMistakes(0);
    setCPM(0);
    setWPM(0);
    setCorrectWrong(Array(paragraph.length).fill(''));
    inputRef.current.focus();
    inputRef.current.value = '';
    setIsTimeUp(false); // Reset time up state
  };

  const handleChange = (e) => {
    const characters = charRef.current;
    let currentChar = charRef.current[charIndex];
    let typedChar = e.target.value.slice(-1);

    if (charIndex < characters.length && timeLeft > 0) {
      if (!isTyping) {
        setIsTyping(true);
      }

      if (typedChar === currentChar.textContent) {
        setCharIndex(charIndex + 1);
        correctWrong[charIndex] = ' correct ';
      } else {
        setCharIndex(charIndex + 1);
        setMistakes(mistakes + 1);
        correctWrong[charIndex] = ' wrong ';
      }

      if (charIndex === characters.length - 1) {
        setIsTyping(false);
      }
    } else {
      setIsTyping(true);
    }
  };

  return (
    <div className="w-2/3 drop-shadow-2xl border-2 p-10 rounded-md bg-white">
      {isTimeUp && <h1 className="text-4xl text-red-500 mb-5">Time's Up!</h1>}
      <div className={`mb-5 text-justify ${isTimeUp ? 'blur-md' : ''}`}> {/* Apply blur when time is up */}
        <input
          type="text"
          ref={inputRef}
          onChange={handleChange}
          className="opacity-0 -z-50 absolute"
        />
        {paragraph.split('').map((char, index) => (
          <span
            key={index} // Add key for proper rendering
            className={`char ${index === charIndex ? 'active' : ''} ${correctWrong[index]}`}
            ref={(e) => (charRef.current[index] = e)}
          >
            {char}
          </span>
        ))}
      </div>
      <hr className='text-xl'/>
      <div className="flex items-center grid grid-cols-5 mt-5">
        <p>Time Left: <strong>{timeLeft}</strong></p>
        <p className="text-red-500">Mistakes: <strong>{mistakes}</strong></p>
        <p>WPM: <strong>{WPM}</strong></p>
        <p>CPM: <strong>{CPM}</strong></p>
        <button
          onClick={resetAll}
          className="rounded-full p-2 pl-5 pr-5 border-2 bg-sky-600 text-white hover:bg-white hover:text-sky-600"
        >
          {isTimeUp ? "Try Again" : "Restart"}
        </button>
      </div>
    </div>
  );
};

export default TypingTest;
