import { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import Filters from './components/Filters';
import Summary from './components/Summary';
import './index.css';

const API = 'http://localhost:5000';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({ category: '', from: '', to: '', title: '' });
  const [summary, setSummary] = useState(null);

  const fetchExpenses = async () => {
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.title) params.title = filters.title;
      const res = await axios.get(`${API}/expenses`, { params });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API}/expenses/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await axios.delete(`${API}/expenses/${id}`);
    fetchExpenses();
    fetchSummary();
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = () => {
    setEditingExpense(null);
    fetchExpenses();
    fetchSummary();
  };

  return (
    <div className="container">
      <h1>Expense Tracker</h1>
      <Summary summary={summary} />
      <ExpenseForm
        editingExpense={editingExpense}
        onSuccess={handleFormSuccess}
        onCancel={() => setEditingExpense(null)}
        API={API}
      />
      <Filters filters={filters} setFilters={setFilters} />
      <ExpenseTable
        expenses={expenses}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}