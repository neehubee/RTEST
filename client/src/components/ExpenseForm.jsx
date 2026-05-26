import { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];
const empty = { title: '', amount: '', category: 'Food', date: '', note: '' };

export default function ExpenseForm({ editingExpense, onSuccess, onCancel, API }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date.slice(0, 10),
        note: editingExpense.note || '',
      });
    } else {
      setForm(empty);
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Title is required');
    if (!form.amount || form.amount <= 0) return setError('Amount must be greater than 0');
    if (!form.date) return setError('Date is required');

    try {
      if (editingExpense) {
        await axios.put(`${API}/expenses/${editingExpense.id}`, form);
      } else {
        await axios.post(`${API}/expenses`, form);
      }
      setForm(empty);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="card">
      <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
          />
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>
        <textarea
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
        />
        <div className="form-actions">
          <button type="submit">{editingExpense ? 'Update' : 'Add Expense'}</button>
          {editingExpense && (
            <button type="button" className="cancel" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}