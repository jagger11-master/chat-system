
import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import './Questions.css';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await userAPI.getAllQuestions();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setMessage({ type: 'error', text: 'Failed to load questions' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    if (!answer.trim()) {
      setMessage({ type: 'error', text: 'Please enter an answer' });
      return;
    }

    try {
      const result = await userAPI.answerQuestion(questionId, answer);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Answer submitted successfully!' });
        setAnswer('');
        setSelectedQuestion(null);
        fetchQuestions();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit answer' });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="questions-container">
      <div className="content-header">
        <h2>All Questions</h2>
        <p>View and answer questions from admin</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {questions.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>No Questions Yet</h3>
          <p>There are no questions available at the moment.</p>
        </div>
      ) : (
        <div className="questions-grid">
          {questions.map((question) => (
            <div key={question._id} className="question-card card">
              <div className="question-header">
                <div className="question-meta">
                  <span className="question-author">
                    Asked by: {question.askedBy?.name || 'Admin'}
                  </span>
                  <span className="question-date">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {question.answer && (
                  <span className="answered-badge">Answered</span>
                )}
              </div>

              <div className="question-content">
                <h3>{question.questionText}</h3>
              </div>

              {question.answer && (
                <div className="answer-section">
                  <label>Your Answer:</label>
                  <p>{question.answer}</p>
                </div>
              )}

              {!question.answer && (
                <div className="answer-form">
                  {selectedQuestion === question._id ? (
                    <>
                      <textarea
                        className="form-textarea"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        rows="4"
                      />
                      <div className="form-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleAnswerSubmit(question._id)}
                        >
                          Submit Answer
                        </button>
                        <button
                          className="btn"
                          style={{ backgroundColor: 'var(--gray-200)' }}
                          onClick={() => {
                            setSelectedQuestion(null);
                            setAnswer('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => setSelectedQuestion(question._id)}
                    >
                      Answer Question
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;