import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";
import { server, Context } from "../../main";
const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const { isregister, setisregister } = useContext(Context);

  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
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
      const response = await axios.post(`${server}/login`, {
        username: inputs.name,
        password: inputs.password,
      },{
        withCredentials: true,
      }
      );
      console.log(response.status); // Assuming your response has data you want to log
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status == 401) {
        alert("Incorrect password...");
        navigate("/login");
      } else {
        // setisregister(true);
        alert("Register first...");
        navigate("/register");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest();
  };

  return (
    <div className="login">
      <form className="loginform" onSubmit={handleSubmit}>
        <label htmlFor="name">Username</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Username..."
          value={inputs.name}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
