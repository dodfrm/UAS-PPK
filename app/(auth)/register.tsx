import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import "../../global.css";
import {useAuth} from "../../Auth/authContext"

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
export default function register() {
  const router = useRouter();
  const { onRegister } = useAuth();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@stis\.ac\.id$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Register function
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await onRegister(formData.name, formData.email, formData.password);
      Alert.alert("Success", "Registration successful!");
      router.push("/(auth)/login");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error instanceof Error ? error.message : "Please try again later"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push("/(auth)/login"); 
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
        <Text style={styles.signUpText}>Create your account</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <View>
          <TextInput
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, name: text }));
              if (errors.name)
                setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholderTextColor="#A9A9A9"
            style={styles.input}
          />
          {errors.name && (
            <Text className="absolute ml-2 text-red-500 text-sm">
              {errors.name}
            </Text>
          )}
        </View>
        <View>
          <TextInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, email: text }));
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            keyboardType="email-address"
            placeholderTextColor="#A9A9A9"
            style={styles.input}
          />
          {errors.email && (
            <Text className="absolute ml-2 mb-auto text-red-500 text-sm">
              {errors.email}
            </Text>
          )}
        </View>
        <View>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            value={formData.password}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, password: text }));
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            secureTextEntry
            style={styles.input}
          />
          {errors.password && (
            <Text className="absolute ml-2 text-red-500 text-sm">
              {errors.password}
            </Text>
          )}
        </View>
        <View>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#A9A9A9"
            value={formData.confirmPassword}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, confirmPassword: text }));
              if (errors.confirmPassword)
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            secureTextEntry
            style={styles.input}
          />
          {errors.confirmPassword && (
            <Text className="absolute ml-2 text-red-500 text-sm">
              {errors.confirmPassword}
            </Text>
          )}
        </View>
      </View>

      {/* Register Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signUpButton} onPress={handleRegister}>
          <Text style={styles.signUpButtonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.backToLogin}>
            Already have an account? Sign In
          </Text>
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
    height: 190,
  },
  helloContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  signUpText: {
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
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  signUpButton: {
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
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  backToLogin: {
    textAlign: "center",
    color: "#007BFF",
    fontSize: 14,
    marginTop: 15,
  },
});
