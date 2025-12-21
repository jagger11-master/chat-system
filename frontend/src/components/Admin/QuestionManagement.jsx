// src/components/Admin/QuestionManagement.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI, userAPI } from '../../services/api';
import './QuestionManagement.css';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [respondingTo, setRespondingTo] = useState(null);
  const [response, setResponse] = useState('');

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

  const handleCreateQuestion = async () => {
    if (!newQuestion.trim()) {
      setMessage({ type: 'error', text: 'Please enter a question' });
      return;
    }

    try {
      const result = await adminAPI.createQuestion(newQuestion);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Question created successfully' });
        setNewQuestion('');
        setIsCreating(false);
        fetchQuestions();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create question' });
    }
  };

  const handleRespondToQuestion = async (questionId) => {
    if (!response.trim()) {
      setMessage({ type: 'error', text: 'Please enter a response' });
      return;
    }

    try {
      const result = await adminAPI.respondToQuestion(questionId, response);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Response sent successfully' });
        setResponse('');
        setRespondingTo(null);
        fetchQuestions();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send response' });
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const result = await adminAPI.deleteQuestion(questionId);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Question deleted successfully' });
        fetchQuestions();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete question' });
    }
  };

  const handleClearAnswer = async (questionId) => {
    if (!window.confirm('Are you sure you want to clear this answer?')) {
      return;
    }

    try {
      const result = await adminAPI.clearAnswer(questionId);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Answer cleared successfully' });
        fetchQuestions();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear answer' });
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
    <div className="question-management">
      <div className="admin-content-header">
        <div>
          <h2>Question Management</h2>
          <p>Create and manage questions for users</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? 'Cancel' : 'Create Question'}
        </button>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {isCreating && (
        <div className="card create-question-card">
          <h3>Create New Question</h3>
          <textarea
            className="form-textarea"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter your question here..."
            rows="4"
          />
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleCreateQuestion}
            >
              Create Question
            </button>
            <button
              className="btn"
              style={{ backgroundColor: 'var(--gray-200)' }}
              onClick={() => {
                setIsCreating(false);
                setNewQuestion('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-number">{questions.length}</span>
          <span className="stat-label">Total Questions</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{questions.filter(q => q.answer).length}</span>
          <span className="stat-label">Answered</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{questions.filter(q => !q.answer).length}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>No Questions Yet</h3>
          <p>Create your first question to get started.</p>
        </div>
      ) : (
        <div className="questions-list">
          {questions.map((question) => (
            <div key={question._id} className="admin-question-card card">
              <div className="question-card-header">
                <div className="question-info">
                  <span className="question-by">
                    Asked by: {question.askedBy?.name || 'Unknown'}
                  </span>
                  <span className="question-date">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="question-actions">
                  <button
                    className="btn-icon btn-icon-delete"
                    onClick={() => handleDeleteQuestion(question._id)}
                    title="Delete Question"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="question-text">
                <h3>{question.questionText}</h3>
              </div>

              {question.answer ? (
                <div className="answer-display">
                  <div className="answer-label">
                    <span>User's Answer:</span>
                    <button
                      className="btn-clear-answer"
                      onClick={() => handleClearAnswer(question._id)}
                    >
                      Clear Answer
                    </button>
                  </div>
                  <p>{question.answer}</p>
                </div>
              ) : respondingTo === question._id ? (
                <div className="respond-form">
                  <label className="form-label">Your Response:</label>
                  <textarea
                    className="form-textarea"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your response..."
                    rows="3"
                  />
                  <div className="form-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRespondToQuestion(question._id)}
                    >
                      Send Response
                    </button>
                    <button
                      className="btn"
                      style={{ backgroundColor: 'var(--gray-200)' }}
                      onClick={() => {
                        setRespondingTo(null);
                        setResponse('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pending-response">
                  <span className="pending-text">Waiting for user response</span>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setRespondingTo(question._id)}
                  >
                    Add Response
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;