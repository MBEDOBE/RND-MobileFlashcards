import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notifications, Permissions} from "expo";
//import * as Permissions from 'expo-permissions';


const NOTIFICATION_KEY = "MobileFlashcards:notifications"

function createNotification() {
    return {
        title: "Study Flashcards Reminder",
        body: "Do not forget to study today!",
        ios: {
            sound: true,
        },
        android: {
            sound: true,
            sticky: false,
        }
    };
};

export function setLocalNotification() {
    AsyncStorage.getItem(NOTIFICATION_KEY)
        .then(JSON.parse)
        .then((data) => {
            if (data === null) {
                Permissions.askAsync(Permissions.NOTIFICATIONS)
                    .then(({ status }) => {
                        if (status === 'granted') {
                            Notifications.cancelAllScheduledNotificationsAsync();
                            let tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            tomorrow.setHours(20);
                            tomorrow.setMinutes(0);

                            Notifications.scheduleLocalNotificationAsync(
                                createNotification(),
                                {
                                    time: tomorrow,
                                    repeat: 'day',
                                }
                            )
                            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
                        }
                    })
            }
        })
}