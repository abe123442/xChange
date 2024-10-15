import express from 'express';
import cors from 'cors';
import { getProfile } from './profile';

const app = express();
app.use(express.json());
app.use(cors());

// ====================================================================
// SERVER ROUTES BELOW ================================================
// ====================================================================

app.get('/', (req, res) => {
  res.send("Server started");
});

app.get('/test', (req, res) => {
  try {
    const response = getProfile(profileid);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});

app.get('/:profileid', (req, res) => {
  const profileid = parseInt(req.params.profileid);
  // const token = req.header('token');

  try {
    const response = getProfile(profileid);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});


// ====================================================================
// SERVER ROUTES ABOVE ================================================
// ====================================================================

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});