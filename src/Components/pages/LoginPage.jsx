import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import byImage from "../../assets/image/clinic.jpg";
import logoImg from "../../assets/image/teeth.png";

const loginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email !== "" && password !== "") {
      setError(false);
      navigate("/dashbord");
    } else {
      setError(true);
    }
  };

  return (
    <div className="container">
      <div
        className="background-overlay"
        style={{ backgroundImage: `url(${byImage})` }}
      ></div>

      <div className="card">
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
              value={email}
              placeholder="Email ID"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-login">
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
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

export default loginPage;
