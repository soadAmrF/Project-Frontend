import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import "@/Pages/Auth/Login//login.css";
import byImage from "@/assets/image/clinic.jpg";
import logoImg from "@/assets/image/teeth.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError(true);
      return;
    }

    setError(false);

    try {
      const response = await api.post("/login", form);
      const token = response.data.data.token;
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(true);
    }
  };

return (
  <div className="login-container">
    <div
      className="background-overlay"
      style={{ backgroundImage: `url(${byImage})` }}
    ></div>

    <div className="login-card">
      <div className="title">
        <img src={logoImg} alt="Clinic logo" />
        <h2>SmileSuite</h2>
      </div>

      <div className="p">
        <p>Please sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-login">
          <input
            type="email"
            name="email"
            placeholder="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-login">
          <input
            type="password"
            name="password"
            placeholder="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {error && (
          <p className="error-message">
            Please enter both email and password.
          </p>
        )}

        <button type="submit" className="btn-login">
          Login
        </button>
      </form>
    </div>
  </div>
);
};

export default LoginPage;
