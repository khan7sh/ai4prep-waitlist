const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    await db.collection('waitlist').add({
      email,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email saved successfully' }),
    };
  } catch (error) {
    console.error('Error saving email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save email' }),
    };
  }
};