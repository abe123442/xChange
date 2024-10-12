import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send("Server started");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});