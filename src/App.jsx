import { useState, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import Header from "./components/header/Header";
import { Context, server } from "./main.jsx";
import VideoRecorder from "./components/VideoRecorder/VideoRecorder.jsx";
import axios from "axios";

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await axios.post(
          `${server}/`,
          {},
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, [setIsAuthenticated]);

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/login" element={<VideoRecorder />} />
              <Route path="/register" element={<VideoRecorder />} />
              <Route path="/" element={<VideoRecorder />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Login />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
