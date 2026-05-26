export default function Summary({ summary }) {
  if (!summary) return null;

  return (
    <div className="card">
      <h2>This Month's Summary</h2>
      <p className="total">Total: ₹{Number(summary.totalThisMonth).toLocaleString()}</p>
      <div className="breakdown">
        {summary.categoryBreakdown.length === 0 && (
          <p>No expenses this month.</p>
        )}
        {summary.categoryBreakdown.map(item => (
          <div key={item.category} className="breakdown-item">
            <span>{item.category}</span>
            <span>₹{Number(item.total).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}