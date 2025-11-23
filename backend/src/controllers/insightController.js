const InsightPreference = require('../models/InsightPreference');

// Get user's insight preferences
exports.getPreferences = async (req, res) => {
  try {
    const userId = req.userId;
    let preferences = await InsightPreference.findOne({ userId });

    if (!preferences) {
      // Create default preferences if they don't exist
      preferences = await InsightPreference.create({
        userId,
        savedInsights: [],
        dismissedInsights: [],
      });
    }

    res.status(200).json(preferences);
  } catch (error) {
    console.error('[GET_PREFERENCES_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

// Save an insight
exports.saveInsight = async (req, res) => {
  try {
    const userId = req.userId;
    const { insightId } = req.body;

    if (!insightId) {
      return res.status(400).json({ error: 'insightId is required' });
    }

    let preferences = await InsightPreference.findOne({ userId });

    if (!preferences) {
      preferences = await InsightPreference.create({
        userId,
        savedInsights: [insightId],
        dismissedInsights: [],
      });
    } else {
      // Add to saved if not already there
      if (!preferences.savedInsights.includes(insightId)) {
        preferences.savedInsights.push(insightId);
      }
      // Remove from dismissed if it was there
      preferences.dismissedInsights = preferences.dismissedInsights.filter(
        id => id !== insightId
      );
      preferences.updatedAt = new Date();
      await preferences.save();
    }

    console.log(`[INSIGHT_SAVED] User ${userId} saved insight: ${insightId}`);
    res.status(200).json(preferences);
  } catch (error) {
    console.error('[SAVE_INSIGHT_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

// Unsave an insight
exports.unsaveInsight = async (req, res) => {
  try {
    const userId = req.userId;
    const { insightId } = req.body;

    if (!insightId) {
      return res.status(400).json({ error: 'insightId is required' });
    }

    const preferences = await InsightPreference.findOne({ userId });

    if (!preferences) {
      return res.status(404).json({ error: 'Preferences not found' });
    }

    preferences.savedInsights = preferences.savedInsights.filter(
      id => id !== insightId
    );
    preferences.updatedAt = new Date();
    await preferences.save();

    console.log(`[INSIGHT_UNSAVED] User ${userId} unsaved insight: ${insightId}`);
    res.status(200).json(preferences);
  } catch (error) {
    console.error('[UNSAVE_INSIGHT_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

// Dismiss an insight
exports.dismissInsight = async (req, res) => {
  try {
    const userId = req.userId;
    const { insightId } = req.body;

    if (!insightId) {
      return res.status(400).json({ error: 'insightId is required' });
    }

    let preferences = await InsightPreference.findOne({ userId });

    if (!preferences) {
      preferences = await InsightPreference.create({
        userId,
        savedInsights: [],
        dismissedInsights: [insightId],
      });
    } else {
      // Add to dismissed if not already there
      if (!preferences.dismissedInsights.includes(insightId)) {
        preferences.dismissedInsights.push(insightId);
      }
      // Remove from saved if it was there
      preferences.savedInsights = preferences.savedInsights.filter(
        id => id !== insightId
      );
      preferences.updatedAt = new Date();
      await preferences.save();
    }

    console.log(`[INSIGHT_DISMISSED] User ${userId} dismissed insight: ${insightId}`);
    res.status(200).json(preferences);
  } catch (error) {
    console.error('[DISMISS_INSIGHT_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

// Restore all dismissed insights
exports.restoreDismissed = async (req, res) => {
  try {
    const userId = req.userId;

    let preferences = await InsightPreference.findOne({ userId });

    if (!preferences) {
      preferences = await InsightPreference.create({
        userId,
        savedInsights: [],
        dismissedInsights: [],
      });
    } else {
      preferences.dismissedInsights = [];
      preferences.updatedAt = new Date();
      await preferences.save();
    }

    console.log(`[INSIGHTS_RESTORED] User ${userId} restored all dismissed insights`);
    res.status(200).json(preferences);
  } catch (error) {
    console.error('[RESTORE_DISMISSED_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};
