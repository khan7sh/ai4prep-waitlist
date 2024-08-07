const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

app.post('/api/submit-email', (req, res) => {
  const { email } = req.body;
  
  // In a production environment, you'd want to use a database instead of a file
  fs.appendFile('emails.txt', email + '\n', (err) => {
    if (err) {
      console.error('Error saving email:', err);
      res.status(500).json({ error: 'Failed to save email' });
    } else {
      res.status(200).json({ message: 'Email saved successfully' });
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});