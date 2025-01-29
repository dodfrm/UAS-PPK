import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: {
    accessToken: string | null;
    authenticated: boolean | null;
    user: User | null;
  };
  onRegister: (name: string, email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

// Interface untuk decoded token dari Spring Boot JWT
interface JwtPayload {
  sub: string; // biasanya berisi username/email
  roles?: string[];
  exp: number;
  // sesuaikan dengan claims yang ada di JWT Anda
}

const TOKEN_KEY = "jwtoken";
export const API_URL = "http://192.168.1.11:8080";

export const AuthContext = createContext<AuthProps>({
  authState: { accessToken: null, authenticated: null, user: null },
  onRegister: async () => {},
  onLogin: async () => {},
  onLogout: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<{
    accessToken: string | null;
    authenticated: boolean | null;
    user: User | null;
  }>({
    accessToken: null,
    authenticated: null,
    user: null,
  });

  // Fungsi untuk mendecode base64 dari token JWT
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload) as JwtPayload;
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return null;
    }
  };

  const loadToken = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);

      if (accessToken) {
        // Set token di header axios
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        try {
          // Ambil data user dari endpoint /user-profile
          const userResponse = await axios.get(`${API_URL}/user-profile`);
          const user = userResponse.data;

          setAuthState({
            accessToken: accessToken,
            authenticated: true,
            user: user,
          });
        } catch (error) {
          // Jika token expired atau invalid, hapus token dan set authenticated false
          console.error("Error fetching user data:", error);
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          setAuthState({
            accessToken: null,
            authenticated: false,
            user: null,
          });
        }
      } else {
        setAuthState({
          accessToken: null,
          authenticated: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Error reading token:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await loadToken();
      } catch (error) {
        console.error("Error loading token:", error);
        setAuthState({
          accessToken: null,
          authenticated: false,
          user: null,
        });
      }
    };

    initializeAuth();
  }, []);

  // register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      if (response.data.accessToken) {
        try {
          await SecureStore.setItemAsync(TOKEN_KEY, response.data.accessToken);

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;

          // Ambil data user setelah register
          const userResponse = await axios.get(`${API_URL}/user-profile`);
          const user = userResponse.data;

          setAuthState({
            accessToken: response.data.accessToken,
            authenticated: true,
            user: user,
          });

          return response.data;
        } catch (error) {
          console.error("Error saving token:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data.accessToken) {
        try {
          await SecureStore.setItemAsync(TOKEN_KEY, response.data.accessToken);

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;

          // Ambil data user setelah login
          const userResponse = await axios.get(`${API_URL}/user-profile`);
          const user = userResponse.data;

          setAuthState({
            accessToken: response.data.accessToken,
            authenticated: true,
            user: user,
          });

          return response.data;
        } catch (error) {
          console.error("Error saving token:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      axios.defaults.headers.common["Authorization"] = "";
      setAuthState({
        accessToken: null,
        authenticated: false,
        user: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
