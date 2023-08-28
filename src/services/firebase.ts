const admin = require('firebase-admin');
const serviceAccount = require('./wavesounds-463fe-firebase-adminsdk-ceu99-aef3e49ea8.json');

const firebaseRoot = admin.initializeApp({
  projectId: 'wavesounds-463fe',
  credential: admin.credential.cert(serviceAccount),
});

export const subscribeTopic = async (fcmToken: string) => {
  const registrationTokens = [fcmToken];

  firebaseRoot
    .messaging()
    .subscribeToTopic(registrationTokens, 'all_users')
    .then(() => {
      console.log('User subscribed to topic successfully!');
    })
    .catch((error: any) => {
      console.error('Error while subscribing to topic:', error);
    });
};

export const unsubscribeTopic = async (fcmToken: string) => {
  firebaseRoot
    .messaging()
    .unsubscribeFromTopic([fcmToken], 'all_users')
    .then(() => {
      console.log('Unsubscribed from topic successfully');
    })
    .catch((error: any) => {
      console.error('Error unsubscribing from topic:', error);
    });
};

export const sendToSubscriptions = async (message: {
  notification: {};
  topic?: string;
  token?: string;
}) => {
  await firebaseRoot
    .messaging()
    .send(message)
    .then(() => {
      console.log('Successfully sent message');
    })
    .catch((error: any) => {
      console.log(`Failed to sent message: ${JSON.stringify(error)}`);
    });
};
