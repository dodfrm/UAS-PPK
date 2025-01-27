import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useAuth } from "../../Auth/authContext";
import "../../global.css";

export default function Login() {
  const router = useRouter();
  const { onLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateToRegister = () => {
    router.push("/(auth)/register");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      const result = await onLogin(email, password);
      // Navigate to main app or home screen
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login Failed", "Invalid credentials. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Top Image */}
      <View style={styles.topImageContainer}>
        <Image
          source={require("../../assets/images/topVector.png")}
          style={styles.topImage}
        />
      </View>

      {/* Welcome Section */}
      <View style={styles.helloContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.signInText}>Sign in to your account</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email or Username"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.register}>Dont have an account? Register</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Image */}
      <Image
        source={require("../../assets/images/bottom-wave.png")}
        style={styles.bottomImage}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
    justifyContent: "space-between",
  },
  topImageContainer: {},
  topImage: {
    width: "100%",
    top: -35,
    height: 150,
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: "center",
    marginTop: -75,
  },
  bottomImage: {
    width: "100%",
    marginTop: 120,
    height: 200,
  },
  helloContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  signInText: {
    textAlign: "center",
    fontSize: 18,
    color: "#6A6A6A",
    marginTop: 5,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 15,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#262626",
  },
  forgotPassword: {
    textAlign: "left",
    color: "#007BFF",
    fontSize: 14,
    marginLeft: 5,
    marginTop: 5,
  },
  register: {
    textAlign: "center",
    color: "#007BFF",
    fontSize: 14,
    marginTop: 15,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  signInButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
