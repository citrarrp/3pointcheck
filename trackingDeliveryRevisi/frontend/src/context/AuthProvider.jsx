import { useState, useEffect } from "react";
import api from "../utils/api";
import { AuthContext } from "./auth.js";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    sessionStorage.getItem("accessToken") || ""
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("Token in AuthProvider:", token);
    const fetchUser = async () => {
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const { data } = await api.get("/user/auth/me");
          setUser(data.user);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        const refreshAccessToken = async () => {
          try {
            const res = await api.post(
              "/auth/refresh-token",
              {},
              { withCredentials: true }
            );
            const { accessToken } = res.data;
            sessionStorage.setItem("accessToken", accessToken);
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;
            setToken(accessToken);
          } catch (err) {
            console.error("Gagal refresh token:", err);
            logout();
          }
        };

        refreshAccessToken();
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // if (token) {
  //   api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //   const fetchUser = async () => {
  //     try {
  //       const token = localStorage.getItem("accessToken");
  //       if (!token) {
  //         console.error("No token found, logging out...");
  //         logout();
  //         return;
  //       }

  //       console.log("Fetching user with token:", token);
  //       const { data } = await api.get("/user/auth/me", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       console.log("User fetched successfully:", data);
  //       setUser(data.user);
  //     } catch (error) {
  //       console.error(
  //         "Failed to fetch user:",
  //         error.response?.data || error.message
  //       );
  //       logout();
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUser();
  // } else {
  //   const refreshAccessToken = async () => {
  //     try {
  //       const res = await api.post("/auth/refresh-token");
  //       const { accessToken } = res.data;
  //       localStorage.setItem("accessToken", accessToken);
  //       api.defaults.headers.common[
  //         "Authorization"
  //       ] = `Bearer ${accessToken}`;
  //       setToken(accessToken);
  //     } catch (err) {
  //       console.error("Gagal refresh token:", err);
  //       logout();
  //     }
  //   };

  //   refreshAccessToken();
  //   delete api.defaults.headers.common["Authorization"];
  //   setUser(null);
  //   setLoading(false);
  // }
  // }, [token]);

  const login = async (fullname, password) => {
    try {
      const res = await api.post("/user/auth/login", {
        fullname,
        password,
      });
      const { accessToken, existingUser } = res.data.data;
      // console.log(res.data, accessToken, existingUser);
      setToken(accessToken);
      setUser(existingUser);
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.getItem("accessToken");
      // console.log(accessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    setToken("");
    sessionStorage.removeItem("accessToken");
    delete api.defaults.headers.common["Authorization"];
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
