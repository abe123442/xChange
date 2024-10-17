import express, { json, Request, Response } from 'express';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { getAllProfiles, getFilteredProfiles, getProfile } from './profile';
import { Error } from './typedef';

const app = express();
app.use(json());
app.use(cors());

// ====================================================================
// SERVER ROUTES BELOW ================================================
// ====================================================================

app.get('/', (req: Request, res: Response) => {
  res.redirect('/home');
});

app.get('/home', (req: Request, res: Response) => {
  try {
    const response = { profiles: getAllProfiles() };
    res.status(200).json(response);
  } catch (e) {
    const error = e as Error;
    res.status(error.status).json({ error: error.message });
  }
});

app.get('/home/search', (req: Request, res: Response) => {
  // const token = req.header('token');
  try {
    const response = getAllProfiles();
    res.status(200).json(response);
  } catch (e) {
    const error = e as Error;
    res.status(error.status).json({ error: error.message });
  }
});

app.get('/profile/:profileid', (req: Request, res: Response) => {
  const profileid = parseInt(req.params.profileid);
  // const token = req.header('token');

  try {
    const response = getProfile(profileid);
    res.status(200).json(response);
  } catch (e) {
    const error = e as Error;
    res.status(error.status).json({ error: error.message });
  }
});

// ====================================================================
// SERVER ROUTES ABOVE ================================================
// ====================================================================

const port = process.env.PORT || 5000;

app.use(errorHandler());

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});