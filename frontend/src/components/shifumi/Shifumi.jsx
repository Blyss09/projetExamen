import React from "react";
import "./shifumi.css";

const CHOICES = [
  { value: "rock", emoji: "✊" },
  { value: "paper", emoji: "✋" },
  { value: "scissors", emoji: "✌️" },
];

const Shifumi = () => {
  return (
    <div className="shifumi-center">
      <div className="shifumi-choices">
        {CHOICES.map((c) => (
          <button
            key={c.value}
            className="shifumi-btn"
            disabled
          >
            <span className="shifumi-emoji">{c.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Shifumi;
