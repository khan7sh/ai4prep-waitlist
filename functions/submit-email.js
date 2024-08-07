const admin = require('firebase-admin');

let db;

exports.handler = async (event, context) => {
  console.log('Function invoked');
  console.log('Event:', JSON.stringify(event));
  console.log('Context:', JSON.stringify(context));

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Initializing Firebase');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
      });
    }
    db = admin.firestore();

    console.log('Parsing request body');
    const { email } = JSON.parse(event.body);
    console.log('Received email:', email);

    console.log('Adding email to Firestore');
    await db.collection('waitlist').add({
      email,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Successfully processed email');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Email saved successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message }),
    };
  }
};