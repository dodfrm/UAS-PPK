import React, {useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth , API_URL} from "../../Auth/authContext";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ProfileScreen = () => {
  const { onLogout, authState } = useAuth();

  //handle logout
  const handleLogout = () => {
    onLogout();
    Alert.alert("Logout", "You have been logged out");
  };

  // Modal states
  const [editField, setEditField] = useState<"name" | "email" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [oldPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Update Profile
  const handleSave = async () => {
    try {
      if (!authState?.user?.id || !editField || !editValue.trim()) {
        Alert.alert("Error", "Field cannot be empty");
        return;
      }

      const updatedData = {
        id: authState?.user?.id,
        name: editField === "name" ? editValue : authState?.user?.name,
        email: editField === "email" ? editValue : authState?.user?.email,
        role: authState?.user?.role,
      };

      await axios.put(
        `${API_URL}/user-profile/${authState.user.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEditField(null);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error, Failed to update profile");
    }
  };


  // Ubah Password
  const handlePasswordChange = async () => {
    try {
      if (!authState?.user?.id) return;

      await axios.put(
        `${API_URL}/user/change-password/${authState.user.id}`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
          },
        }
      );
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      Alert.alert("Success", "Password updated successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Failed to update password");
    }
  };

  // Hapus Akun
  const handleDeleteAccount = async () => {
    try {
      if (!authState?.user?.id) return;

      const response = await axios.delete(
        `${API_URL}/user/${authState.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            "Content-Type": "application/json",
          },
          data: { password },
        }
      );

      onLogout();
      Alert.alert("Account Deleted", response.data);
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error Failed to delete account");
    }
  };


  const openEdit = (field: "name" | "email") => {
    setEditValue(authState?.user?.[field] ?? "");
    setEditField(field);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Profile Header */}
      <View className="bg-white dark:bg-gray-800 p-4 mb-2">
        <View className="items-center py-4">
          <View className="h-24 w-24 rounded-full bg-blue-500 items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">
              {authState?.user?.name
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("")}
            </Text>
          </View>
        </View>
      </View>

      {/* Profile Info List */}
      <View className="bg-white dark:bg-gray-800 mb-2">
        <TouchableOpacity
          onPress={() => openEdit("name")}
          className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <View className="flex-1 pl-4">
            <Text className="text-md text-gray-500 dark:text-gray-400">
              Name
            </Text>
            <Text className="text-lg text-gray-900 dark:text-white">
              {authState?.user?.name}
            </Text>
          </View>
          <Text className="text-blue-500 pr-3">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openEdit("email")}
          className="flex-row items-center p-4"
        >
          <View className="flex-1 pl-4">
            <Text className="text-md text-gray-500 dark:text-gray-400">
              Email
            </Text>
            <Text className="text-lg text-gray-900 dark:text-white">
              {authState?.user?.email}
            </Text>
          </View>
          <Text className="text-blue-500 pr-3">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <View className="bg-white dark:bg-gray-800 mb-2 ">
        <TouchableOpacity
          onPress={() => setShowPasswordModal(true)}
          className="p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <Text className="pl-4 text-lg text-gray-900 dark:text-white">
            Change Password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowDeleteModal(true)}
          className="p-4"
        >
          <Text className="pl-4 text-lg text-red-500">Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={() => setShowLogoutModal(true)}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg items-center justify-center"
      >
        <Text className="text-lg text-gray-900 dark:text-white">Logout</Text>
      </TouchableOpacity>

      {/* Edit Field Modal */}
      <Modal
        visible={editField !== null}
        animationType="fade"
        transparent={true}
      >
        <View className="flex-1 justify-center bg-black/50 px-4">
          <View className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3">
            <View className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit {editField === "name" ? "Name" : "Email"}
              </Text>
            </View>

            <View className="p-4 mt-4">
              <TextInput
                className="border text-lg border-gray-300 dark:border-gray-600 p-3 rounded-xl mb-8 text-gray-900 dark:text-white"
                value={editValue}
                onChangeText={setEditValue}
                placeholder={
                  editField === "name" ? "Enter name" : "Enter email"
                }
                placeholderTextColor="#9CA3AF"
                keyboardType={
                  editField === "email" ? "email-address" : "default"
                }
                autoCapitalize={editField === "name" ? "words" : "none"}
              />

              <View className="flex-row gap-6">
                <TouchableOpacity
                  onPress={() => setEditField(null)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-xl"
                >
                  <Text className="font-semibold text-center text-gray-900 dark:text-white">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  className="flex-1 bg-blue-500 p-3 rounded-xl"
                >
                  <Text className="font-semibold text-center text-white">
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="fade"
        transparent={true}
      >
        <View className="flex-1 justify-center bg-black/50 px-4">
          <View className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3">
            <View className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                Change Password
              </Text>
            </View>

            <View className="p-4 mt-4">
              <TextInput
                className="border text-lg border-gray-300 dark:border-gray-600 p-3 rounded-xl mb-4 text-gray-900 dark:text-white"
                value={oldPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />

              <TextInput
                className="border text-lg border-gray-300 dark:border-gray-600 p-3 rounded-xl mb-4 text-gray-900 dark:text-white"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />

              <View className="flex-row gap-6 mt-4">
                <TouchableOpacity
                  onPress={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-xl"
                >
                  <Text className="font-semibold text-center text-gray-900 dark:text-white">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePasswordChange}
                  className="flex-1 bg-blue-500 p-3 rounded-xl"
                >
                  <Text className="font-semibold text-center text-white">
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal visible={showDeleteModal} animationType="fade" transparent={true}>
        <View className="flex-1 justify-center bg-black/50 px-4">
          <View className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3">
            <View className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                Delete Account
              </Text>
            </View>

            <View className="p-4 mt-4">
              <Text className="text-gray-600 dark:text-gray-400 mb-4">
                Enter your password to confirm account deletion
              </Text>

              <TextInput
                className="border text-lg border-gray-300 dark:border-gray-600 p-3 rounded-lg mb-4 text-gray-900 dark:text-white"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />

              <View className="flex-row gap-6 mt-4">
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <Text className="font-semibold text-center text-gray-900 dark:text-white">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDeleteAccount}
                  className="flex-1 bg-red-500 p-3 rounded-lg"
                >
                  <Text className="font-semibold text-center text-white">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} animationType="fade" transparent={true}>
        <View className="flex-1 justify-center bg-black/50 px-4">
          <View className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3">
            <View className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                Logout
              </Text>
            </View>

            <View className="p-4 mt-4">
              <Text className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to logout?
              </Text>
              <View className="flex-row gap-6 mt-4">
                <TouchableOpacity
                  onPress={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <Text className="font-semibold text-center text-gray-900 dark:text-white">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleLogout}
                  className="flex-1 bg-blue-500 p-3 rounded-lg"
                >
                  <Text className="font-semibold text-center text-white">
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;