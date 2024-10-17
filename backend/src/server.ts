import express, { json, Request, Response } from 'express';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { getAllProfiles, getFilteredProfiles, getProfile } from './profile';
import { register, login, logout } from './auth';
import { Error } from './typedef';
import { validateToken } from './auth';

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
    const response = getAllProfiles();
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

/**
 * Filtered profiles
 * name: string
 * desc: string
 * country: string
 * scope: string
 * degLevels: string[]
 * category: string
 * minWam: number
 * load: string
 * link: string
 * img: string
 */
app.get('/profile/filtered', (req: Request, res: Response) => {
  try {
    validateToken(req.headers.token as string);
  }
  catch (e) {
    const error = e as Error;
    res.status(401).json({error: error.message});
  }
  res.json(getFilteredProfiles(req.body.name, req.body.desc, req.body.country, req.body.scope, JSON.parse(req.body.degLevels as string), req.body.category, parseInt(req.body.minWam as string), req.body.load, req.body.link, req.body.img));
});

app.post('/register', (req: Request, res: Response) => {
  try {
    res.json(register(req.body.email, req.body.password, req.body.nameFirst, req.body.nameLast, req.body.username));
  }
  catch (e) {
    const error = e as Error;
    res.status(400).json({error: error.message});
  }
});

app.post('/login', (req: Request, res: Response) => {
  try {
    res.json(login(req.body.email, req.body.password));
  }
  catch (e) {
    const error = e as Error;
    res.status(400).json({error: error.message});
  }
});

app.post('/logout', (req: Request, res: Response) => {
  try {
    validateToken(req.headers.token as string);
  }
  catch (e) {
    const error = e as Error;
    res.status(401).json({error: error.message});
  }
  res.json(logout(req.headers.token as string));
});



// ====================================================================
// SERVER ROUTES ABOVE ================================================
// ====================================================================

const port = process.env.PORT || 5000;

app.use(errorHandler());

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});