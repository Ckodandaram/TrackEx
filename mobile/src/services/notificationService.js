import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  requestPermissions: async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  },

  scheduleExpenseReminder: async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't forget to track your expenses! 📊",
        body: 'Keep your finances in check by logging your daily expenses.',
        data: { type: 'reminder' },
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      },
    });
  },

  sendBudgetAlert: async (storyName, percentage) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Budget Alert',
        body: `You've used ${percentage}% of your budget for "${storyName}"`,
        data: { type: 'budget_alert' },
      },
      trigger: null,
    });
  },

  cancelAllNotifications: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
