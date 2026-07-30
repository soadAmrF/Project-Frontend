const UserStats = ({ users }) => {
  const totalUsers = users.length;

  const admins = users.filter((user) => user.role === "admin").length;

  const employees = users.filter((user) => user.role === "employee").length;

  const activeUsers = users.filter((user) => user.isActive).length;

  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      color: "primary",
      icon: "bi-people-fill",
    },
    {
      title: "Admins",
      value: admins,
      color: "danger",
      icon: "bi-shield-lock-fill",
    },
    {
      title: "Employees",
      value: employees,
      color: "success",
      icon: "bi-person-badge-fill",
    },
    {
      title: "Active Users",
      value: activeUsers,
      color: "warning",
      icon: "bi-person-check-fill",
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => (
        <div className="col-6 col-md-3" key={card.title}>
          <div className="card shadow-sm border-0 stats-card h-100">
            <div className="card-body d-flex align-items-center">
              <div className={`stats-icon bg-${card.color}`}>
                <i className={`bi ${card.icon}`}></i>
              </div>

              <div className="ms-3">
                <small className="text-muted">{card.title}</small>

                <h4 className="mb-0">{card.value}</h4>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
