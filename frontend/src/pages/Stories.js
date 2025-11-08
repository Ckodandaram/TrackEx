import React, { useState, useEffect } from 'react';
import { storyService } from '../services/storyService';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyDetails, setStoryDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await storyService.getAll();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoryDetails = async (id) => {
    try {
      const data = await storyService.getById(id);
      setStoryDetails(data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching story details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStory) {
        await storyService.update(editingStory._id, formData);
      } else {
        await storyService.create(formData);
      }
      setShowModal(false);
      setEditingStory(null);
      resetForm();
      fetchStories();
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      name: story.name,
      budget: story.budget,
      startDate: new Date(story.startDate).toISOString().split('T')[0],
      endDate: new Date(story.endDate).toISOString().split('T')[0],
      description: story.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await storyService.delete(id);
        fetchStories();
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      budget: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const handleNewStory = () => {
    setEditingStory(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Stories</h2>
        <button className="btn-primary" onClick={handleNewStory}>
          Add Story
        </button>
      </div>

      <div className="story-list">
        {stories.length === 0 ? (
          <div className="card">No stories found</div>
        ) : (
          stories.map((story) => (
            <div key={story._id} className="story-item">
              <div className="story-info">
                <h4>{story.name}</h4>
                <p><strong>Budget:</strong> ₹{story.budget}</p>
                <p>
                  <strong>Duration:</strong>{' '}
                  {new Date(story.startDate).toLocaleDateString()} -{' '}
                  {new Date(story.endDate).toLocaleDateString()}
                </p>
                {story.description && <p><em>{story.description}</em></p>}
              </div>
              <div className="story-actions">
                <button className="btn-small btn-primary" onClick={() => fetchStoryDetails(story._id)}>
                  View
                </button>
                <button className="btn-small btn-edit" onClick={() => handleEdit(story)}>
                  Edit
                </button>
                <button className="btn-small btn-delete" onClick={() => handleDelete(story._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingStory ? 'Edit Story' : 'Add Story'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Budget</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editingStory ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && storyDetails && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{storyDetails.story.name}</h3>
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>Budget:</strong> ₹{storyDetails.story.budget}</p>
              <p><strong>Total Spent:</strong> ₹{storyDetails.analytics.totalSpent.toFixed(2)}</p>
              <p><strong>Remaining:</strong> ₹{storyDetails.analytics.remaining.toFixed(2)}</p>
              <p><strong>Usage:</strong> {storyDetails.analytics.percentage}%</p>
              {storyDetails.analytics.isOverBudget && (
                <p style={{ color: 'red' }}>⚠️ Over Budget!</p>
              )}
            </div>
            
            <h4>Expenses ({storyDetails.expenses.length})</h4>
            {storyDetails.expenses.length === 0 ? (
              <p>No expenses linked to this story</p>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {storyDetails.expenses.map((expense) => (
                  <div key={expense._id} style={{ 
                    borderBottom: '1px solid #eee', 
                    padding: '0.5rem 0',
                    marginBottom: '0.5rem'
                  }}>
                    <p><strong>₹{expense.amount}</strong> - {expense.category}</p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>
                      {new Date(expense.date).toLocaleDateString()} - {expense.paymentMode}
                    </p>
                    {expense.notes && <p style={{ fontSize: '0.875rem' }}>{expense.notes}</p>}
                  </div>
                ))}
              </div>
            )}
            
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
