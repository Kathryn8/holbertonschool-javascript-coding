const express = require('express');
const countStudents = require('./3-read_file_async');

const app = express();
const port = 1245;

app.get('/', (req, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', (req, res) => {
  countStudents(process.argv[2])
    .then((studentData) => {
      res.send(`This is the list of our students\n${studentData}`);
    })
    .catch((error) => {
      res.status(500).send(`This is the list of our students\n${error.message}`);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
