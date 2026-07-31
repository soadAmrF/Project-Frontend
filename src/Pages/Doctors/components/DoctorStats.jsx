const stats = [
  {
    title: "Total Doctors",
    number: "8",
    text: "All active doctors",
    icon: "bi bi-person-badge",
    color: "primary",
  },

  {
    title: "Active Doctors",
    number: "7",
    text: "Currently working",
    icon: "bi bi-check-circle",
    color: "success",
  },

  {
    title: "Appointments Today",
    number: "32",
    text: "Across all doctors",
    icon: "bi bi-calendar-event",
    color: "warning",
  },

  {
    title: "Total Patients",
    number: "1,248",
    text: "All time",
    icon: "bi bi-people",
    color: "purple",
  },
];

export default function DoctorStats() {
  return (
    <div className="row g-4">
      {stats.map((item, index) => (
        <div className="col-lg-3 col-md-6" key={index}>
          <div className="stat-card">
            <div className={`stat-icon ${item.color}`}>
              <i className={item.icon}></i>
            </div>

            <div>
              <h3>{item.number}</h3>

              <p>{item.title}</p>

              <span>{item.text}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
