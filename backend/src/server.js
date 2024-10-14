import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// ====================================================================
// SERVER ROUTES BELOW ================================================
// ====================================================================

app.get('/', (req, res) => {
  res.send("Server started");
});

app.get('/:infoid', (req, res) => {
  const infoid = parseInt(req.params.infoid);
  const token = req.header('token');

  try {
    const response = viewInfo(token, infoid);
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