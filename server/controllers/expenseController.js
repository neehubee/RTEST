const pool = require('../db');

// POST /expenses
const addExpense = async (req, res) => {
  const { title, amount, category, date, note } = req.body;

  if (!title || !amount || amount <= 0 || !date) {
    return res.status(400).json({ error: 'Title, amount and date are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO expenses (title, amount, category, date, note) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, amount, category, date, note]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /expenses
const getExpenses = async (req, res) => {
  const { category, from, to, title } = req.query;
  let query = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }
  if (from) {
    params.push(from);
    query += ` AND date >= $${params.length}`;
  }
  if (to) {
    params.push(to);
    query += ` AND date <= $${params.length}`;
  }
  if (title) {
    params.push(`%${title}%`);
    query += ` AND title ILIKE $${params.length}`;
  }

  query += ' ORDER BY date DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /expenses/:id
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /expenses/:id
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date, note } = req.body;

  if (!title || !amount || amount <= 0 || !date) {
    return res.status(400).json({ error: 'Title, amount and date are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE expenses SET title=$1, amount=$2, category=$3, date=$4, note=$5 WHERE id=$6 RETURNING *',
      [title, amount, category, date, note, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /expenses/summary
const getSummary = async (req, res) => {
  try {
    const total = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE)`
    );

    const breakdown = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE)
       GROUP BY category
       ORDER BY total DESC`
    );

    res.json({
      totalThisMonth: total.rows[0].total,
      categoryBreakdown: breakdown.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addExpense, getExpenses, deleteExpense, updateExpense, getSummary };