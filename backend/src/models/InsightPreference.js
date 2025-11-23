const mongoose = require('mongoose');

const insightPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  savedInsights: {
    type: [String],
    default: [],
  },
  dismissedInsights: {
    type: [String],
    default: [],
  },
  lastGeneratedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InsightPreference', insightPreferenceSchema);
