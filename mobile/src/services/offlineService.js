import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_EXPENSES_KEY = 'offline_expenses';

export const offlineService = {
  saveExpenseOffline: async (expenseData) => {
    try {
      const existingData = await AsyncStorage.getItem(OFFLINE_EXPENSES_KEY);
      const expenses = existingData ? JSON.parse(existingData) : [];
      
      expenses.push({
        ...expenseData,
        offlineId: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });
      
      await AsyncStorage.setItem(OFFLINE_EXPENSES_KEY, JSON.stringify(expenses));
      return true;
    } catch (error) {
      console.error('Error saving offline expense:', error);
      return false;
    }
  },

  getOfflineExpenses: async () => {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_EXPENSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting offline expenses:', error);
      return [];
    }
  },

  clearOfflineExpenses: async () => {
    try {
      await AsyncStorage.removeItem(OFFLINE_EXPENSES_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing offline expenses:', error);
      return false;
    }
  },

  syncOfflineExpenses: async (expenseService) => {
    try {
      const offlineExpenses = await offlineService.getOfflineExpenses();
      
      if (offlineExpenses.length === 0) {
        return { success: true, synced: 0 };
      }

      let syncedCount = 0;
      for (const expense of offlineExpenses) {
        try {
          await expenseService.create(expense);
          syncedCount++;
        } catch (error) {
          console.error('Error syncing expense:', error);
        }
      }

      if (syncedCount === offlineExpenses.length) {
        await offlineService.clearOfflineExpenses();
      }

      return { success: true, synced: syncedCount, total: offlineExpenses.length };
    } catch (error) {
      console.error('Error syncing offline expenses:', error);
      return { success: false, error: error.message };
    }
  },
};
