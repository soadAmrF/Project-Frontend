import { useEffect, useState } from "react";
import { createDoctor, getUsers } from "@/services/api";

export default function AddDoctorModal({ onClose, fetchDoctors }) {
  const [doctorsUsers, setDoctorsUsers] = useState([]);

  const [formData, setFormData] = useState({
    userId: "",
    specialization: "",
    experienceYears: "",
    bio: "",
    degree: "",
    fees: "",
    workingDays: [],
    workingHours: {
      start: "",
      end: "",
    },
    address: "",
  });

  useEffect(() => {
    const fetchDoctorUsers = async () => {
      try {
        const res = await getUsers();

        const doctors = res.data.users.filter((user) => user.role === "doctor");

        setDoctorsUsers(doctors);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctorUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      workingHours: {
        ...formData.workingHours,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createDoctor(formData);

      await fetchDoctors();

      console.log(res.data);

      onClose();
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  return (
    <div className="doctor-modal-overlay">
      <div className="doctor-modal-card">
        <div className="doctor-modal-header">
          <div className="doctor-modal-title">
            <div className="doctor-modal-icon">
              <i className="bi bi-person-plus"></i>
            </div>

            <div>
              <h3>Add Doctor</h3>
              <p>Add a new doctor to the clinic</p>
            </div>
          </div>

          <button
            type="button"
            className="doctor-modal-close"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="doctor-modal-form">
          <div className="doctor-modal-body">
            <div className="doctor-form-section">
              <div className="doctor-section-title">
                <i className="bi bi-person"></i>
                <span>Doctor Information</span>
              </div>

              <div className="doctor-form-grid">
                <div className="doctor-form-group full">
                  <label>Doctor</label>

                  <select
                    className="doctor-form-control"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                  >
                    <option value="">Select Doctor</option>

                    {doctorsUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.fullname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="doctor-form-group">
                  <label>Specialization</label>

                  <input
                    className="doctor-form-control"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>

                <div className="doctor-form-group">
                  <label>Experience Years</label>

                  <input
                    className="doctor-form-control"
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                  />
                </div>

                <div className="doctor-form-group">
                  <label>Degree</label>

                  <input
                    className="doctor-form-control"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                  />
                </div>

                <div className="doctor-form-group">
                  <label>Fees</label>

                  <input
                    className="doctor-form-control"
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="doctor-form-section">
              <div className="doctor-section-title">
                <i className="bi bi-calendar-week"></i>
                <span>Working Schedule</span>
              </div>

              <div className="doctor-form-group">
                <label>Working Days</label>

                <div className="working-days">
                  {days.map((day) => (
                    <label key={day} className="day-item">
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              workingDays: [...formData.workingDays, day],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              workingDays: formData.workingDays.filter(
                                (item) => item !== day,
                              ),
                            });
                          }
                        }}
                      />

                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="doctor-time-grid">
                <div className="doctor-form-group">
                  <label>Start Time</label>

                  <input
                    type="time"
                    className="doctor-form-control"
                    name="start"
                    value={formData.workingHours.start}
                    onChange={handleTimeChange}
                  />
                </div>

                <div className="doctor-form-group">
                  <label>End Time</label>

                  <input
                    type="time"
                    className="doctor-form-control"
                    name="end"
                    value={formData.workingHours.end}
                    onChange={handleTimeChange}
                  />
                </div>
              </div>
            </div>

            <div className="doctor-form-section">
              <div className="doctor-section-title">
                <i className="bi bi-geo-alt"></i>
                <span>Additional Information</span>
              </div>

              <div className="doctor-form-group">
                <label>Address</label>

                <input
                  className="doctor-form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="doctor-form-group">
                <label>Bio</label>

                <textarea
                  rows="4"
                  className="doctor-form-control doctor-textarea"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="doctor-modal-footer">
            <button
              type="button"
              className="doctor-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="doctor-save-btn">
              <i className="bi bi-check-lg"></i>
              Save Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
