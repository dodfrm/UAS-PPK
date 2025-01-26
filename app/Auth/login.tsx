import React from "react";
import { useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import "../../global.css";

export default function login() {

  const router = useRouter();

  const navigateToRegister = () => {
    router.push("/Auth/register"); 
  };
  return (
    <View style={styles.container}>
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
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signInButton}>
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
    </View>
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
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#262626",
  },
  forgotPassword: {
    textAlign: "left",
    color: "#007BFF",
    fontSize: 14,
    marginLeft: 5,
    marginTop: -5,
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
