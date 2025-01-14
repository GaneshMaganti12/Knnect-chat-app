const admin = require("firebase-admin");
const serviceAccount = require("../../knnectServiceAccountKey.json");

// Firebase Admin SDK initialization
// Initialize the Firebase Admin SDK using the service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
module.exports = { auth };
