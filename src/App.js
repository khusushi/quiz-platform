import React from "react";
import Quiz from "./components/Quiz";
import questions from "./data/questions.json";

function App() {
  return (
    <div>
      <h1>Quiz Platform</h1>
      <Quiz questions={questions} />
    </div>
  );
}

export default App;
