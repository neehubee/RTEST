const validateExpense = (req, res, next) => {
  const { title, amount, date } = req.body;
  const errors = [];

  if (!title || !title.trim()) {
    errors.push('Title is required');
  }

  if (title && title.trim().length > 255) {
    errors.push('Title must be under 255 characters');
  }

  if (amount === undefined || amount === null || amount === '') {
    errors.push('Amount is required');
  } else if (isNaN(amount) || Number(amount) <= 0) {
    errors.push('Amount must be a positive number');
  }

  if (!date) {
    errors.push('Date is required');
  } else if (isNaN(Date.parse(date))) {
    errors.push('Invalid date format');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validateExpense;