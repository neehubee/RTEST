const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.log('DB connection FAILED:', err);
  else console.log('DB connected at:', res.rows[0].now);
});

app.use('/expenses', expenseRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));