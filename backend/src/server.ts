import express, { json, Request, Response } from 'express';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { createProfile, getAllProfiles, getFilteredProfiles, getProfile } from './profile';
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
  const name = req.query.name as string;
  const desc = req.query.desc as string;
  const country = req.query.country as string;
  const scope = req.query.scope as string;
  const category = req.query.category as string;
  const minWam = parseInt(req.query.minWam as string);
  const degLevels = req.query.degLevels as string[];
  const load = req.query.load as string;

  try {
    const response = { profiles: 
      getFilteredProfiles(name, desc, country, scope, degLevels, category, minWam, load) 
    };
    res.status(200).json(response);
  } catch (e) {
    const error = e as Error;
    res.status(error.status).json({ error: error.message });
  }
});

app.get('/profile/:profileid', (req: Request, res: Response) => {
  const profileid = parseInt(req.params.profileid);

  try {
    const response = { profile : getProfile(profileid) };
    res.status(200).json(response);
  } catch (e) {
    const error = e as Error;
    res.status(error.status).json({ error: error.message });
  }
});

app.get('/profile/:profileid', (req: Request, res: Response) => {
  const { token, name, desc, country, scope, category, minWam, degLevels, load, 
    link, img } = req.body;

  try {
    const response = createProfile(token, name, desc, country, scope, degLevels,
      category, minWam, load, link, img
    );
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