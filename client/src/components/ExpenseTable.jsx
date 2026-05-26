export default function ExpenseTable({ expenses, onDelete, onEdit }) {
  if (expenses.length === 0) {
    return (
      <div className="card">
        <p>No expenses found.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Expenses</h2>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.date.slice(0, 10)}</td>

              <td>{exp.title}</td>

              <td>
                <span>{exp.category}</span>
              </td>

              <td>
                ₹{Number(exp.amount).toLocaleString()}
              </td>

              <td>{exp.note || '-'}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() => onEdit(exp)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => onDelete(exp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}