import React, { createContext, useEffect, useState } from "react";
import axiosInstance, { setAccessToken } from "./axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, updateAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAccessToken = async () => {
    try {
      const res = await axiosInstance.post("api/token/refresh/");
      const token = res.data.access_token;
      updateAccessToken(token);
      setAccessToken(token);
    } catch (err) {
      updateAccessToken(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccessToken();
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      updateAccessToken(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, logout, updateAccessToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
