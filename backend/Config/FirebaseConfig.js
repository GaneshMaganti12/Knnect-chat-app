const admin = require("firebase-admin");
require("dotenv").config();
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Firebase Admin SDK initialization
// Initialize the Firebase Admin SDK using the service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
module.exports = { auth };
