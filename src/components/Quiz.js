import React, { useState, useEffect } from "react";

const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 to show instructions
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(30); // Timer for each question
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);

  // Load attempt history from IndexedDB on mount
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
    setHistory(storedHistory);
  }, []);

  // Save attempt history to IndexedDB whenever it updates
  useEffect(() => {
    localStorage.setItem("quizHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      setTimer(30);
      const timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            handleNext(); // Auto-move to next question when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [currentQuestion]);

  const handleStart = () => {
    setCurrentQuestion(0); // Move to the first question
    setUserAnswers({});
    setScore(0);
    setQuizEnded(false);
  };

  const handleAnswer = (answer) => {
    const correctAnswer = questions[currentQuestion].answer;
    setUserAnswers({ ...userAnswers, [currentQuestion]: answer });
    if (answer === correctAnswer) {
      setFeedback("Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback("Incorrect");
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleEndQuiz();
    }
    setFeedback(null);
  };

  const handleEndQuiz = () => {
    setQuizEnded(true);
    const attempt = {
      score,
      totalQuestions: questions.length,
      date: new Date().toLocaleString(),
    };
    setHistory([attempt, ...history]); // Add the current attempt to history
  };

  if (currentQuestion === -1) {
    return (
      <div>
        <h2>Instructions:</h2>
        <ul>
          <li>1. For multiple-choice questions, select the one best answer (A, B, C, or D).</li>
          <li>2. For integer-type questions, write your numerical answer clearly.</li>
          <li>3. No calculators unless specified.</li>
          <li>4. You have 30 minutes to complete this quiz.</li>
        </ul>
        <button onClick={handleStart}>Start Quiz</button>
        <h2>Attempt History:</h2>
        {history.length > 0 ? (
          <ul>
            {history.map((attempt, index) => (
              <li key={index}>
                Attempt {index + 1}: Score {attempt.score}/{attempt.totalQuestions} on {attempt.date}
              </li>
            ))}
          </ul>
        ) : (
          <p>No attempts yet.</p>
        )}
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>Your Score: {score}/{questions.length}</p>
        <button onClick={() => setCurrentQuestion(-1)}>Back to Instructions</button>
        <h2>Attempt History:</h2>
        {history.length > 0 ? (
          <ul>
            {history.map((attempt, index) => (
              <li key={index}>
                Attempt {index + 1}: Score {attempt.score}/{attempt.totalQuestions} on {attempt.date}
              </li>
            ))}
          </ul>
        ) : (
          <p>No attempts yet.</p>
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div>
      <h2>Question {currentQuestion + 1}:</h2>
      <h3>{question.question}</h3>
      <p>Time Left: {timer} seconds</p>

      {question.type === "multiple-choice" && (
        <div>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(String.fromCharCode(65 + index))}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
      )}

      {question.type === "integer" && (
        <div>
          <input
            type="number"
            onBlur={(e) => handleAnswer(parseInt(e.target.value))}
          />
        </div>
      )}

      {feedback && <p>{feedback}</p>}

      {currentQuestion < questions.length - 1 && (
        <button onClick={handleNext}>Next</button>
      )}
    </div>
  );
};

export default Quiz;
