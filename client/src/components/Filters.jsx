const CATEGORIES = ['', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];

export default function Filters({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', from: '', to: '', title: '' });
  };

  return (
    <div className="card">
      <h2>Filters</h2>
      <div className="form-row">
        <input
          name="title"
          placeholder="Search by title"
          value={filters.title}
          onChange={handleChange}
        />
        <select name="category" value={filters.category} onChange={handleChange}>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c || 'All Categories'}</option>
          ))}
        </select>
        <input name="from" type="date" value={filters.from} onChange={handleChange} />
        <input name="to" type="date" value={filters.to} onChange={handleChange} />
        <button onClick={clearFilters}>Clear</button>
      </div>
    </div>
  );
}