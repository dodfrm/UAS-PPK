import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "jwtoken";
export const API_URL = "https://api.developbetterapps.com";

export const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    // Check for existing token on app startup
    loadToken();
  }, []);

  const loadToken = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthState({
        token: token,
        authenticated: true,
      });
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
      });

      if (response.data.token) {
        setAuthState({
          token: response.data.token,
          authenticated: true,
        });

        // Store token securely
        await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);

        // Set default authorization header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        return response.data;
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data.token) {
        setAuthState({
          token: response.data.token,
          authenticated: true,
        });

        // Store token securely
        await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);

        // Set default authorization header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        return response.data;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    // Remove token from secure storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    // Reset axios authorization header
    axios.defaults.headers.common["Authorization"] = "";

    // Update auth state
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
