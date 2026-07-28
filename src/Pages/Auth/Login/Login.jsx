import { api } from "@/services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const HandleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.name, e.target.value);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await api.post("/login", form);
    // console.log(response);
    
    const token = response.data.data.token;
    localStorage.setItem("token", token);

    // console.log(localStorage.getItem("token"));

    navigate('/dashboard');
  };


  return (
    <>
    
    <form action="" onSubmit={HandleSubmit}>
        <input type="email" name="email" placeholder="email" value={form.email} onChange={HandleChange} />
        <input type="password" name="password" placeholder="password" value={form.password} onChange={HandleChange} />
        <button type="submit">Login</button>
      </form>

    </>
    )
}
