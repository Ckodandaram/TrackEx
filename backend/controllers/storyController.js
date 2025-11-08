const Story = require('../models/Story');
const Expense = require('../models/Expense');

// @desc    Get all stories for user
// @route   GET /api/stories
// @access  Private
const getStories = async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user._id }).sort({ startDate: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single story with details
// @route   GET /api/stories/:id
// @access  Private
const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Make sure user owns story
    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Get expenses linked to this story
    const expenses = await Expense.find({ story: story._id });
    
    // Calculate total spent
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate percentage and insights
    const percentage = story.budget > 0 ? (totalSpent / story.budget) * 100 : 0;
    const remaining = story.budget - totalSpent;
    
    res.json({
      story,
      expenses,
      analytics: {
        totalSpent,
        budget: story.budget,
        remaining,
        percentage: percentage.toFixed(2),
        isOverBudget: totalSpent > story.budget
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new story
// @route   POST /api/stories
// @access  Private
const createStory = async (req, res) => {
  try {
    const { name, budget, startDate, endDate, description } = req.body;

    const story = await Story.create({
      user: req.user._id,
      name,
      budget,
      startDate,
      endDate,
      description
    });

    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update story
// @route   PUT /api/stories/:id
// @access  Private
const updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Make sure user owns story
    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Make sure user owns story
    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Unlink expenses from this story
    await Expense.updateMany(
      { story: story._id },
      { $set: { story: null } }
    );

    await story.deleteOne();

    res.json({ message: 'Story removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory
};
