const pool = require('../db');

const addExpense = async (req, res) => {
  const { title, amount, category, date, note } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO expenses 
      (title, amount, category, date, note) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [
        title.trim(),
        Number(amount),
        category,
        date,
        note || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getExpenses = async (req, res) => {
  const { category, from, to, title } = req.query;

  let query = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }

  if (from) {
    if (isNaN(Date.parse(from))) {
      return res.status(400).json({
        error: 'Invalid from date'
      });
    }
  }

  if (to) {
    if (isNaN(Date.parse(to))) {
      return res.status(400).json({
        error: 'Invalid to date'
      });
    }
  }

  // Fix for weird date ranges
  if (from && to && new Date(from) > new Date(to)) {
    return res.status(400).json({
      error: 'From date cannot be after to date'
    });
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
    params.push(`%${title.trim()}%`);
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

const deleteExpense = async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Invalid ID'
    });
  }

  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    res.json({
      message: 'Expense deleted'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error'
    });
  }
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date, note } = req.body;

  if (isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Invalid ID'
    });
  }

  try {
    const result = await pool.query(
      `UPDATE expenses 
       SET title = $1,
           amount = $2,
           category = $3,
           date = $4,
           note = $5
       WHERE id = $6
       RETURNING *`,
      [
        title.trim(),
        Number(amount),
        category,
        date,
        note || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error'
    });
  }
};

const getSummary = async (req, res) => {
  try {
    const total = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM expenses
      WHERE DATE_TRUNC('month', date) =
            DATE_TRUNC('month', CURRENT_DATE)
    `);

    const breakdown = await pool.query(`
      SELECT category,
             COALESCE(SUM(amount), 0) AS total
      FROM expenses
      WHERE DATE_TRUNC('month', date) =
            DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY category
      ORDER BY total DESC
    `);

    res.json({
      totalThisMonth: total.rows[0].total,
      categoryBreakdown: breakdown.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error'
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getSummary
};