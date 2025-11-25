import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import NotificationService from './notificationService';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

const processNotifications = async () => {
    const notifications = await NotificationService.getAll();
    notifications.forEach(async ({ id, title, body}) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                data: { timestamp: Date.now() },
            },
            trigger: null, // Send immediately
        });
        NotificationService.markRead(id)
    });
}

// Define the background task
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  try {
    await processNotifications();
    console.log('Background notification sent successfully');
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('Error in background task:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export { BACKGROUND_NOTIFICATION_TASK, processNotifications };
