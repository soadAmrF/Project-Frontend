const UserStats = ({ users }) => {
  const totalUsers = users.length;

  const admins = users.filter((user) => user.role === "admin").length;

  const doctors = users.filter((user) => user.role === "doctor").length;

  const receptionists = users.filter(
    (user) => user.role === "receptionist",
  ).length;

  const activeUsers = users.filter((user) => user.isActive).length;

  const cards = [
  {
    title: "Total Users",
    value: totalUsers,
    icon: "bi-person-lines-fill",
    iconClass: "users-blue",
  },
  {
    title: "Admins",
    value: admins,
    icon: "bi-shield-check",
    iconClass: "users-purple",
  },
  {
    title: "Doctors",
    value: doctors,
    icon: "bi-heart-pulse-fill",
    iconClass: "users-green",
  },
  {
    title: "Receptionists",
    value: receptionists,
    icon: "bi-headset",
    iconClass: "users-orange",
  },
];

  return (
  <div className="users-stats">
    {cards.map((card) => (
      <div className="stats-card" key={card.title}>
        <div className={`stats-icon bg-${card.color}`}>
          <i className={`bi ${card.icon}`}></i>
        </div>

        <div className="ms-3">
          <small>{card.title}</small>
          <h4>{card.value}</h4>
        </div>
      </div>
    ))}
  </div>
);
};

export default UserStats;
