import React, { useState, useEffect } from "react";

// Sample words
const sampleWords = [
  {
    word: "HELLO",
    description: "A common greeting to say hi."
  },
  {
    word: "WORLD",
    description: "The planet we live on, full of land and water."
  },
  {
    word: "JAVASCRIPT",
    description: "A popular language for building interactive websites."
  },
  {
    word: "REACT",
    description: "A powerful library for building modern UIs."
  },
  {
    word: "PROGRAMMING",
    description: "Writing code to make computers perform tasks."
  },
  {
    word: "GEEKSFORGEEKS",
    description: "An educational site for computer science enthusiasts."
  }
];

// Helper function to pick a random word object
const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * sampleWords.length);
  return sampleWords[randomIndex];
};

// QWERTY keyboard rows
const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const App = () => {
  // Game state
  const [wordData, setWordData] = useState(getRandomWord());
  const [chosenLetters, setChosenLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [hints, setHints] = useState(3);

  // Message and UI toggles
  const [message, setMessage] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  // If 3 wrong guesses, show alert & restart
  useEffect(() => {
    if (wrongGuesses >= 3) {
      window.alert("Game Over! You made too many wrong guesses.");
      restartGame();
    }
  }, [wrongGuesses]);

  // Select a letter button
  const handleLetterClick = (letter) => {
    if (!chosenLetters.includes(letter)) {
      setChosenLetters((prev) => [...prev, letter]);
      if (!wordData.word.includes(letter)) {
        setWrongGuesses((prev) => prev + 1);
      }
    }
  };

  // Reveal one hidden letter
  const handleHint = () => {
    if (hints === 0) return;
    const hiddenLetterIndex = wordData.word
      .split("")
      .findIndex((letter) => !chosenLetters.includes(letter));
    // If there's at least one hidden letter
    if (hiddenLetterIndex !== -1) {
      setChosenLetters((prev) => [...prev, wordData.word[hiddenLetterIndex]]);
      setHints((prev) => prev - 1);
    }
  };

  // Remove the last chosen letter
  const handleRemoveLast = () => {
    setChosenLetters((prev) => prev.slice(0, -1));
  };

  // Check if all letters in word are guessed
  const isWordFullyGuessed = () => {
    return wordData.word.split("").every((letter) => chosenLetters.includes(letter));
  };

  // Make a guess
  const handleGuess = () => {
    if (isWordFullyGuessed()) {
      setMessage("Congratulations! You guessed the word correctly!");
    } else {
      setMessage("Sorry, that's not correct. Try again!");
      setShowAnswer(true);
    }
  };

  // Restart game
  const restartGame = () => {
    setWordData(getRandomWord());
    setChosenLetters([]);
    setWrongGuesses(0);
    setHints(3);
    setMessage("");
    setShowAnswer(false);
  };

  // Render the QWERTY keyboard layout
  const renderKeyboard = () => {
    return keyboardRows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center mb-2">
        {row.split("").map((letter) => {
          const isSelected = chosenLetters.includes(letter);
          return (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              disabled={isSelected}
              className={`m-1 p-2 w-10 h-10 flex items-center justify-center 
                border rounded-full transition-all font-semibold shadow-sm
                ${
                  isSelected
                    ? // Already picked
                      "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : // Default
                      "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
                }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    ));
  };

  return (
    // Page Background
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 flex items-center justify-center p-4">
      {/* Main Card */}
      <div
        className="
          bg-white shadow-2xl rounded-xl w-full max-w-2xl p-6 md:p-8 
        "
      >
        {/* Title with Gradient Text */}
        <h1
          className="
            text-center text-4xl md:text-5xl font-extrabold mb-6 tracking-wide 
            bg-clip-text text-transparent bg-purple-600
          "
        >
          Word Guess Game
        </h1>

        {/* Word Display */}
        <div className="flex justify-center mb-6">
          {wordData.word.split("").map((letter, idx) => (
            <span
              key={idx}
              className={`
                mx-1 text-2xl md:text-3xl 
                border-b-4 w-8 md:w-10 text-center font-bold 
                transition-colors duration-300 
                ${
                  chosenLetters.includes(letter)
                    ? "text-indigo-700 border-indigo-700"
                    : "text-transparent border-gray-400"
                }
              `}
            >
              {chosenLetters.includes(letter) ? letter : ""}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="italic text-center mb-6 text-gray-700">
          <span className="font-semibold text-indigo-700">Hint:</span>{" "}
          {wordData.description}
        </p>

        {/* Message */}
        {message && (
          <div
            className="
              mb-6 text-center text-lg md:text-xl font-semibold px-4 py-2 rounded
              bg-green-100 text-green-700 border-l-4 border-green-500
            "
          >
            {message}
            {showAnswer && (
              <div className="mt-1 text-gray-800">
                Correct word was:{" "}
                <strong className="text-indigo-700">{wordData.word}</strong>
              </div>
            )}
          </div>
        )}

        {/* Game Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={restartGame}
            className="
              bg-green-600 text-white px-5 py-2 rounded-full 
              hover:bg-green-500 active:scale-95 transition-all font-semibold
            "
          >
            Restart
          </button>
          <button
            onClick={handleRemoveLast}
            disabled={!chosenLetters.length}
            className={`
              px-5 py-2 rounded-full text-white font-semibold transition-all
              ${
                chosenLetters.length
                  ? "bg-red-600 hover:bg-red-500 active:scale-95"
                  : "bg-red-300 cursor-not-allowed"
              }
            `}
          >
            Remove Letter
          </button>
        </div>

        {/* Alphabet (QWERTY) Buttons */}
        <div className="mb-6">{renderKeyboard()}</div>

        {/* Hints */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-2 font-medium">
            <span className="text-indigo-700 font-bold">{hints}</span> hint
            {hints !== 1 ? "s" : ""} remaining
          </div>
          <button
            onClick={handleHint}
            disabled={hints === 0}
            className={`px-6 py-2 rounded-full font-semibold transition-all
              ${
                hints > 0
                  ? "bg-yellow-500 text-white hover:bg-yellow-400 active:scale-95"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }
            `}
          >
            Get Hint
          </button>
        </div>

        {/* Guess Button */}
        {!message && (
          <div className="text-center">
            <button
              onClick={handleGuess}
              disabled={!chosenLetters.length}
              className={`
                px-8 py-3 rounded-full text-white font-bold text-lg md:text-xl tracking-wide
                transition-all active:scale-95
                ${
                  chosenLetters.length
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-blue-300 cursor-not-allowed"
                }
              `}
            >
              Guess
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
