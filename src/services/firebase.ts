const admin = require('firebase-admin');
const serviceAccount = require('./wavesounds-463fe-firebase-adminsdk-ceu99-aef3e49ea8.json');

export const firebaseRoot = admin.initializeApp({
  projectId: 'wavesounds-463fe',
  credential: admin.credential.cert(serviceAccount),
});
