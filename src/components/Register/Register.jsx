import React, { useContext, useState } from "react";
import "../Register/Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context, server } from "../../main";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post(
        `${server}/register`,
        {
          username: inputs.name,
          email: inputs.email,
          password: inputs.password,
        },
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      if (error.response.status === 400) {
        alert("Already registered...");
        navigate("/login");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest();
  };

  return (
    <div className="Register">
      <form className="Registerform" onSubmit={handleSubmit}>
        <label htmlFor="name">Username</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Username..."
          value={inputs.name}
          onChange={handleChange}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email..."
          value={inputs.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter Password..."
          value={inputs.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
