// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "@/services/axios";
// import "@/Pages/Auth/Login//login.css";
// import byImage from "@/assets/image/clinic.jpg";
// import logoImg from "@/assets/image/teeth.png";

// const LoginPage = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     password: "",
//   });

//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//     console.log(e.target.name, e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");

//     try {
//       const response = await axios.post("/auth", form);

//       const token = response.data.data.token;

//       localStorage.setItem("token", token);

//       localStorage.setItem(
//         "user",
//         JSON.stringify({
//           role: response.data.data.role,
//         }),
//       );

//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div
//         className="background-overlay"
//         style={{ backgroundImage: `url(${byImage})` }}
//       ></div>

//       <div className="login-card">
//         <div className="title">
//           <img src={logoImg} alt="Clinic logo" />
//           <h2>SmileSuite</h2>
//         </div>

//         <div className="p">
//           <p>Please sign in to your account</p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="input-login">
//             <input
//               type="text"
//               name="name"
//               placeholder="Username"
//               value={form.name}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="input-login">
//             <input
//               type="password"
//               name="password"
//               placeholder="password"
//               value={form.password}
//               onChange={handleChange}
//             />
//           </div>

//           {error && <p className="error-message">{error}</p>}

//           <button type="submit" className="btn-login">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import "@/Pages/Auth/Login//login.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard"); // توجيه مباشر فوراً
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Clinic Management</h2>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <button type="submit" className="btn-login">
          Login
        </button>
      </form>
    </div>
  );
}
