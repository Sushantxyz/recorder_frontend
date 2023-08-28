import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../header/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { Context, server } from "../../main";

const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [islogout, setislogout] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.post(`${server}/logout`,{},{
        withCredentials: true,
      });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      setIsAuthenticated(true);
    }
  };

  const handleToggle = () => {
    setIsRegister((prevIsRegister) => !prevIsRegister);
  };

  return (
    <>
      <div className="container">
        <div className="logo">Recorder</div>

        <nav className="nav">
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            Home
          </Link>
        </nav>

        {isAuthenticated ? (
          <button onClick={logoutHandler} className="btn">
            Logout
          </button>
        ) : (
          <Link to={isRegister ? "/register" : "/login"} onClick={handleToggle}>
            {isRegister ? "Register" : "Login"}
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
