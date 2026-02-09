"use client";

import { useState, useEffect } from "react";

export default function GuessingGame() {
  const [randomNumber, setRandomNumber] = useState<number>(
    Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Guess a number between 1 and 100!");
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<"playing" | "success" | "fail">("playing");
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (status === "success") {
      setCelebrate(true);
      const timer = setTimeout(() => setCelebrate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleGuess = () => {
    if (status !== "playing") return;

    const userGuess = parseInt(guess);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      setMessage("⚠️ Enter a number between 1 and 100!");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const diff = Math.abs(userGuess - randomNumber);

    if (userGuess === randomNumber) {
      setMessage(`🎉 Amazing! You guessed it in ${newAttempts} attempts!`);
      setStatus("success");
    } else if (newAttempts >= 5) {
      setMessage(`💥 Game over! The number was ${randomNumber}. Try again!`);
      setStatus("fail");
    } else if (userGuess < randomNumber) {
      setMessage(diff <= 5 ? "⬆️ Close! Slightly higher!" : "⬆️ Too low! Go higher!");
    } else {
      setMessage(diff <= 5 ? "⬇️ Close! Slightly lower!" : "⬇️ Too high! Go lower!");
    }

    setGuess("");
  };

  const resetGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setMessage("Guess a number between 1 and 100!");
    setAttempts(0);
    setStatus("playing");
    setCelebrate(false);
  };

  const messageStyle =
    status === "success"
      ? "text-green-400 animate-pulse text-2xl font-bold"
      : status === "fail"
      ? "text-red-500 animate-shake text-2xl font-bold"
      : "text-yellow-400";

  const bgStyle =
    status === "success"
      ? "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-bg-pulse"
      : status === "fail"
      ? "bg-gradient-to-r from-red-500 via-yellow-500 to-red-700 animate-bg-shake"
      : "bg-gray-800";

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 ${bgStyle} transition-all duration-500 relative`}
    >
      {/* Celebration emojis */}
      {celebrate && (
        <div className="absolute top-10 flex gap-2 text-5xl animate-bounce">
          🎉✨🥳🎊
        </div>
      )}

      <h1 className="text-4xl font-bold mb-6 text-white">Number Guessing Game</h1>
      <p className={`${messageStyle} mb-4 text-center`}>{message}</p>

      {status === "playing" && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={guess}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setGuess(value);
            }}
            maxLength={3}
            className="border p-2 rounded w-24 text-center"
          />
          <button
            onClick={handleGuess}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Guess
          </button>
        </div>
      )}

      {(status === "success" || status === "fail") && (
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition mt-4"
        >
          Play Again
        </button>
      )}

      <p className="mt-4 text-gray-200">Attempts: {attempts} / 5</p>
    </div>
  );
}
