import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';

const AttemptHistory = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      const db = await openDB('QuizHistoryDB', 1);
      const allAttempts = await db.getAll('attempts');
      setAttempts(allAttempts);
    };

    fetchAttempts();
  }, []);

  return (
    <div>
      <h1>Attempt History</h1>
      {attempts.map((attempt, index) => (
        <div key={index}>
          <p>Score: {attempt.score}</p>
        </div>
      ))}
    </div>
  );
};

export default AttemptHistory;
