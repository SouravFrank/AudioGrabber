require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetchRoutes = require('./routes/fetchRoutes');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static('public'));
app.use('/', fetchRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
