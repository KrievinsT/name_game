import React, { useState, useEffect } from "react";

const sampleWords = [
  { word: "HELLO", description: "A common greeting to say hi." },
  { word: "WORLD", description: "The planet we live on, full of land and water." },
  { word: "JAVASCRIPT", description: "A popular language for building interactive websites." },
  { word: "REACT", description: "A powerful library for building modern UIs." },
  { word: "PROGRAMMING", description: "Writing code to make computers perform tasks." },
  { word: "GEEKSFORGEEKS", description: "An educational site for computer science enthusiasts." },
];

const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * sampleWords.length);
  return sampleWords[randomIndex];
};

const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const hangmanStages = [
  "", // No hangman
  "Head", // Head
  "Head, Body", // Body
  "Head, Body, Left Arm", // Left Arm
  "Head, Body, Left Arm, Right Arm", // Right Arm
  "Head, Body, Left Arm, Right Arm, Left Leg", // Left Leg
  "Head, Body, Left Arm, Right Arm, Left Leg, Right Leg" // Full Hangman
];

const App = () => {
  const [wordData, setWordData] = useState(getRandomWord());
  const [chosenLetters, setChosenLetters] = useState([]);
  const [lives, setLives] = useState(6);
  const [hints, setHints] = useState(3);
  const [message, setMessage] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (lives === 0) {
      setMessage("Game Over! The hangman is complete.");
      setShowAnswer(true);
    }
  }, [lives]);

  useEffect(() => {
    if (lives > 0 && wordData.word.split("").every((letter) => chosenLetters.includes(letter))) {
      setMessage("Congratulations! You guessed the word correctly!");
      setShowAnswer(true);
      setHints((prev) => prev + 1); // Add a hint when the word is guessed correctly
    }
  }, [chosenLetters, wordData.word, lives]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft > 1) {
          return prevTimeLeft - 1;
        } else {
          setLives((prevLives) => {
            if (prevLives > 0) {
              return prevLives - 1;
            } else {
              clearInterval(timer);
              return prevLives;
            }
          });
          return 10;
        }
      });
    }, 1000); // Decrease time left every second

    if (lives === 0 || (lives > 0 && wordData.word.split("").every((letter) => chosenLetters.includes(letter)))) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [lives, chosenLetters, wordData.word]);

  const handleLetterClick = (letter) => {
    if (lives === 0 || showAnswer) return; // Prevent typing when game is over
    if (!chosenLetters.includes(letter)) {
      setChosenLetters((prev) => [...prev, letter]);
      if (!wordData.word.includes(letter)) {
        setLives((prev) => prev - 1);
      }
    }
  };

  const handleHint = () => {
    if (hints === 0) return;
    const hiddenLetterIndex = wordData.word
      .split("")
      .findIndex((letter) => !chosenLetters.includes(letter));

    if (hiddenLetterIndex !== -1) {
      setChosenLetters((prev) => [...prev, wordData.word[hiddenLetterIndex]]);
      setHints((prev) => prev - 1);
    }
  };

  const restartGame = () => {
    setWordData(getRandomWord());
    setChosenLetters([]);
    setLives(6);
    setMessage("");
    setShowAnswer(false);
    setTimeLeft(10);
  };

  const renderKeyboard = () => {
    return keyboardRows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center mb-2 flex-wrap">
        {row.split("").map((letter) => {
          const isSelected = chosenLetters.includes(letter);
          const isCorrect = isSelected && wordData.word.includes(letter);
          const isWrong = isSelected && !wordData.word.includes(letter);

          let buttonColor = "bg-blue-500 hover:bg-blue-400";
          if (isCorrect) buttonColor = "bg-green-500";
          if (isWrong) buttonColor = "bg-red-500";

          return (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              disabled={isSelected || lives === 0 || showAnswer} // Disable buttons when game is over
              className={`m-1 p-2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center border rounded-full transition-all font-semibold text-white active:scale-95 ${buttonColor} ${isSelected ? "cursor-not-allowed" : ""}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    ));
  };

  const renderHangman = () => {
    if (!wordData) return null; // Add this check
    const stage = hangmanStages[6 - lives];
    return (
      <div className="flex justify-center items-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-24 sm:w-28 md:w-36 ${
            darkMode ? "text-gray-400" : "text-gray-800"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <line x1="4" y1="22" x2="20" y2="22" stroke="currentColor" strokeWidth="2" /> {/* Base */}
          <line x1="8" y1="22" x2="8" y2="2" stroke="currentColor" strokeWidth="2" /> {/* Pole */}
          <line x1="8" y1="2" x2="16" y2="2" stroke="currentColor" strokeWidth="2" /> {/* Top */}
          <line x1="16" y1="2" x2="16" y2="4" stroke="currentColor" strokeWidth="2" /> {/* Rope */}
          {stage.includes("Head") && (
            <circle cx="16" cy="6" r="2" stroke="currentColor" strokeWidth="1" fill="none" />
          )} {/* Head */}
          {stage.includes("Body") && <line x1="16" y1="8" x2="16" y2="14" stroke="currentColor" strokeWidth="1" />} {/* Body */}
          {stage.includes("Left Arm") && (
            <line x1="16" y1="10" x2="14" y2="12" stroke="currentColor" strokeWidth="1" />
          )} {/* Left Arm */}
          {stage.includes("Right Arm") && (
            <line x1="16" y1="10" x2="18" y2="12" stroke="currentColor" strokeWidth="1" />
          )} {/* Right Arm */}
          {stage.includes("Left Leg") && (
            <line x1="16" y1="14" x2="15" y2="18" stroke="currentColor" strokeWidth="1" />
          )} {/* Left Leg */}
          {stage.includes("Right Leg") && (
            <line x1="16" y1="14" x2="17" y2="18" stroke="currentColor" strokeWidth="1" />
          )} {/* Right Leg */}
        </svg>
      </div>
    );
  };

  const renderWordBoxes = () => {
    return (
      <div className="flex justify-center mb-4 gap-2">
        {wordData.word.split("").map((letter, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 rounded-md font-bold text-lg sm:text-xl ${
              chosenLetters.includes(letter)
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-gray-300 text-transparent dark:border-gray-600"
            }`}
          >
            {chosenLetters.includes(letter) ? letter : ""}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center p-4">
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full transition-all"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-6 tracking-wide bg-clip-text text-transparent bg-blue-600 dark:bg-blue-400">
        Word Guess Game
      </h1>

      <div className="relative border-4 border-blue-500 dark:border-blue-400 rounded-xl w-full max-w-2xl p-4 md:p-6">
        <div className="absolute top-4 right-4 text-lg font-bold text-blue-500 dark:text-blue-400">
          Time left: {timeLeft}s
        </div>
        {renderHangman()}
        {renderWordBoxes()}

        <p className="italic text-center text-sm md:text-base mb-4">
          <span className="font-semibold text-blue-500 dark:text-blue-400">Hint:</span>{" "}
          <span className="text-blue-900 dark:text-gray-300">{wordData.description}</span>
        </p>

        {message && (
          <div
            className={`mb-4 text-center text-sm md:text-lg font-semibold px-4 py-3 rounded shadow-md ${
              message.includes("Congratulations")
                ? "bg-green-100 text-green-800 border-l-4 border-green-600 dark:bg-green-800 dark:text-green-200 dark:border-green-500"
                : "bg-red-100 text-red-800 border-l-4 border-red-600 dark:bg-red-800 dark:text-red-200 dark:border-red-500"
            }`}
          >
            {message}
            {showAnswer && (
              <div className="mt-2 text-blue-600 dark:text-blue-400 text-sm">
                <p className="font-semibold">Correct word was:</p>
                <p className="text-lg font-bold">{wordData.word}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleHint}
          disabled={hints === 0}
          className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            hints > 0 ? "bg-yellow-500 hover:bg-yellow-400" : "bg-yellow-300 cursor-not-allowed"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.999 2a7 7 0 00-7 7 6.99 6.99 0 003.052 5.81c.052.034.103.07.153.107A3.001 3.001 0 008 17a3 3 0 006 0 3.001 3.001 0 00-.205-1.083c.05-.037.101-.073.153-.107A6.99 6.99 0 0019 9a7 7 0 00-7-7z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 17h8m-5.305 3a1.995 1.995 0 003.61 0"
            />
          </svg>
        </button>

        <div className="text-center mt-6 font-medium text-blue-900 dark:text-gray-300 text-sm">
          <span className="text-blue-500 font-bold dark:text-blue-400">{hints}</span> hint
          {hints !== 1 ? "s" : ""} remaining
        </div>

        <div className="mb-4">{renderKeyboard()}</div>

        <div className="flex justify-center">
          <button
            onClick={restartGame}
            className="bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-400 active:scale-95 transition-all font-semibold"
          >
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;