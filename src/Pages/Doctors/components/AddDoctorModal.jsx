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
    <div className="modal-overlay">
      <form className="modal-card" onSubmit={handleSubmit}>
        <h3 className="mb-4">Add Doctor</h3>

        <div className="mb-3">
          <label>Doctor</label>

          <select
            className="form-select"
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

        <div className="mb-3">
          <label>Specialization</label>
          <input
            className="form-control"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Experience Years</label>
          <input
            className="form-control"
            type="number"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Degree</label>
          <input
            className="form-control"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Fees</label>
          <input
            className="form-control"
            type="number"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Working Days</label>

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

        <div className="row">
          <div className="col">
            <label>Start</label>

            <input
              type="time"
              className="form-control"
              name="start"
              value={formData.workingHours.start}
              onChange={handleTimeChange}
            />
          </div>

          <div className="col">
            <label>End</label>

            <input
              type="time"
              className="form-control"
              name="end"
              value={formData.workingHours.end}
              onChange={handleTimeChange}
            />
          </div>
        </div>

        <div className="my-3">
          <label>Address</label>

          <input
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Bio</label>

          <textarea
            rows="4"
            className="form-control"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>

          <button className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
