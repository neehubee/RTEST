const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const validateExpense = require('../middleware/validateExpense');

router.get('/summary', expenseController.getSummary);
router.get('/', expenseController.getExpenses);
router.post('/', validateExpense, expenseController.addExpense);
router.put('/:id', validateExpense, expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;