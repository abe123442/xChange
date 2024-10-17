import express, { json, Request, Response } from 'express';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { tryCreateProfile, getAllProfiles, getFilteredProfiles, getProfile } from './profile';
import { register, login, logout } from './auth';
import { Error } from './typedef';
import { uploadExcelToDatabase } from './excelConverter';
import { clear } from './other';
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
    const response = { profiles: getAllProfiles() };
    res.status(200).json(response);
  } catch (e) {
    const error = e as Error;
    res.status(error.status ? error.status : 500).json({ error: error.message });
  }
});

app.post('/upload', (req: Request, res: Response) => {
  try {
    res.status(200).json(uploadExcelToDatabase('Partner Placement Guide.xlsx'));
  } catch (e) {
    const error = e as Error;
    res.status(error.status ? error.status : 500).json({ error: error.message });
  }
});

app.delete('/clear', (req: Request, res: Response) => {
  try {
    res.status(200).json(clear());
  } catch (e) {
    const error = e as Error;
    res.status(error.status ? error.status : 500).json({ error: error.message });
  }
})

app.get('/home/search', (req: Request, res: Response) => {
  const name = req.query.name as string;
  const desc = req.query.desc as string;
  const country = req.query.country as string;
  const scope = req.query.scope as string;
  const category = req.query.category as string;
  const minWam = parseInt(req.query.minWam as string);
  const degLevels = req.query.degLevels as string;
  const load = req.query.load as string;

  try {
    const response = { profiles: 
      getFilteredProfiles(name, desc, country, scope, degLevels, category, minWam, load) 
    };
    res.status(200).json(response);
  } catch (e) {
    const error = e as Error;
    res.status(error.status ? error.status : 500).json({ error: error.message });
  }
});

app.get('/profile/:profileid', (req: Request, res: Response) => {
  const profileid = parseInt(req.params.profileid);

  try {
    const response = { profile : getProfile(profileid) };
    res.status(200).json(response);
  } catch (e) {
    const error = e as Error;
    res.status(error.status ? error.status : 500).json({ error: error.message });
  }
});

app.post('/profile/:profileid', (req: Request, res: Response) => {
  const token = req.header('token') as string;
  const { name, desc, country, scope, category, minWam, degLevels, load, 
    link, img } = req.body;

  try {
    const response = tryCreateProfile(token, name, desc, country, scope, degLevels,
      category, minWam, load, link, img
    );
    res.status(200).json(response);
  } catch (e) {
    const error = e as Error;
    res.status(error.status ? error.status : 500).json({ error: error.message });
  }
});

app.post('/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast, username } = req.body;

  try {
    const response = register(email, password, nameFirst, nameLast, username);
    res.status(200).json(response);
  }
  catch (e) {
    const error = e as Error;
    res.status(error.status ? error.status : 500).json({ error: error.message });
  }
});

app.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const response = login(email, password);
    res.status(200).json(response);
  }
  catch (e) {
    const error = e as Error;
    res.status(error.status ? error.status : 500).json({ error: error.message });
  }
});

app.post('/logout', (req: Request, res: Response) => {
  const token = req.header('token') as string;

  try {
    const response = logout(token);
    res.status(200).json(response);
  }
  catch (e) {
    const error = e as Error;
    res.status(error.status ? error.status : 500).json({ error: error.message });
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