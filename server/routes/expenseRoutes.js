const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/summary', expenseController.getSummary);
router.post('/', expenseController.addExpense);
router.get('/', expenseController.getExpenses);
router.delete('/:id', expenseController.deleteExpense);
router.put('/:id', expenseController.updateExpense);

module.exports = router;