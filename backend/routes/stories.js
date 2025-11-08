const express = require('express');
const router = express.Router();
const {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory
} = require('../controllers/storyController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getStories)
  .post(protect, createStory);

router.route('/:id')
  .get(protect, getStory)
  .put(protect, updateStory)
  .delete(protect, deleteStory);

module.exports = router;
