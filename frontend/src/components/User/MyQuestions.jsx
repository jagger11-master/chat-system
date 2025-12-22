
import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import './Questions.css';

const MyQuestions = () => {
  const [myQuestions, setMyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAsking, setIsAsking] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMyQuestions();
  }, []);

  const fetchMyQuestions = async () => {
    try {
      const data = await userAPI.getMyQuestions();
      setMyQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setMessage({ type: 'error', text: 'Failed to load your questions' });
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) {
      setMessage({ type: 'error', text: 'Please enter a question' });
      return;
    }

    try {
      const result = await userAPI.askQuestion(newQuestion);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Question sent to admin!' });
        setNewQuestion('');
        setIsAsking(false);
        fetchMyQuestions();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send question' });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your questions...</p>
      </div>
    );
  }

  return (
    <div className="questions-container">
      <div className="content-header">
        <div>
          <h2>My questions</h2>
          <p>Questions you've asked to admin</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsAsking(!isAsking)}
        >
          {isAsking ? 'Cancel' : 'Ask Question'}
        </button>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {isAsking && (
        <div className="card ask-question-card">
          <h3>Ask a New Question</h3>
          <textarea
            className="form-textarea"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            rows="4"
          />
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleAskQuestion}
            >
              Send Question
            </button>
            <button
              className="btn"
              style={{ backgroundColor: 'var(--gray-200)' }}
              onClick={() => {
                setIsAsking(false);
                setNewQuestion('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {myQuestions.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2"/>
            <polyline points="14 2 14 8 20 8" strokeWidth="2"/>
          </svg>
          <h3>No Questions Yet</h3>
          <p>You haven't asked any questions. Click "Ask Question" to get started!</p>
        </div>
      ) : (
        <div className="questions-grid">
          {myQuestions.map((question) => (
            <div key={question._id} className="question-card card">
              <div className="question-header">
                <span className="question-date">
                  {new Date(question.createdAt).toLocaleDateString()}
                </span>
                {question.answer ? (
                  <span className="answered-badge">Answered</span>
                ) : (
                  <span className="pending-badge">Pending</span>
                )}
              </div>

              <div className="question-content">
                <h3>{question.questionText}</h3>
              </div>

              {question.answer && (
                <div className="answer-section">
                  <label>Admin's Answer:</label>
                  <p>{question.answer}</p>
                </div>
              )}

              {!question.answer && (
                <div className="pending-notice">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" strokeWidth="2"/>
                  </svg>
                  <span>Waiting for admin response...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuestions;