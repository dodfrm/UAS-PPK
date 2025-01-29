import React, { useState, useEffect,useRef} from "react";
import {
  View,
  Text,
  Linking ,
  FlatList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAuth, API_URL } from "@/Auth/authContext";
import { Picker } from "@react-native-picker/picker";

// interface Contact
interface Contact {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  contactType: string;
}

//  interface Organisasi
interface Organization {
  id: number;
  organizationName: string;
  contacts: Array<{
    id: number;
    fullName: string;
    phone: string;
    email: string;
    contactType: string;
  }>;
}

// interface untuk menambahkan contact di organisasi
interface ContactAssignment {
  contactId: number;
  kelas: string;
  organizationId: number;
  jabatan: "KETUA" | "WAKIL_KETUA" | "BENDAHARA" | "PJ_MATKUL";
  periodeJabatan: string;
}

const Groups = () => {
  const { authState } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const [contactAssignmentModal, setContactAssignmentModal] = useState(false);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [contactAssignment, setContactAssignment] = useState<ContactAssignment>(
    {
      contactId: 0,
      kelas: "",
      organizationId: 0,
      jabatan: "KETUA",
      periodeJabatan: "",
    }
  );

  // Fungsi untuk menghandle delete
  const handleDelete = async () => {
    try {
      // Kirim request DELETE ke endpoint /api/organizations/{id}
      if (!selectedOrg) {
        Alert.alert("Error", "No organization selected");
        return;
      }

      const response = await axios.delete(`${API_URL}/api/organizations/${selectedOrg.id}`, {
        headers: {
          Authorization: `Bearer ${authState?.accessToken}`, 
        },
      });

      if (response.status === 200) {
        Alert.alert("Sukses Menghapus Organisasi");
        setShowDeleteModal(false);
        setSelectedOrg(null);
        fetchOrganizations();
      }
    } catch (error) {
      Alert.alert("Gagal Menghapus Organisasi", "Data Tidak Sesuai atau Anda Bukan Admin")
    }
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  // Fetch available contacts
  const fetchAvailableContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/contacts`, {
        headers: {
          Authorization: `Bearer ${authState?.accessToken}`,
        },
      });
      setAvailableContacts(response.data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch contacts");
    }
  };

  // Handle contact assignment submission
  const handleContactAssignment = async () => {
    if (
      !contactAssignment.contactId ||
      !contactAssignment.kelas ||
      !contactAssignment.periodeJabatan
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/contact-organizations`,
        {
          ...contactAssignment,
          organizationId: selectedOrg?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", "Contact assigned successfully!");
      setContactAssignmentModal(false);
      fetchOrganizations();
      fetchAvailableContacts();
    } catch (err) {
      Alert.alert("Gagal Menambah Organisasi, Anda Bukan Admin");
    }
  };

  // Toggle contact assignment modal
  const toggleContactAssignmentModal = () => {
    if (!contactAssignmentModal) {
      fetchAvailableContacts();
    }
    setContactAssignmentModal(!contactAssignmentModal);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    if (!authState?.accessToken) {
      const router = useRouter();
      router.replace("../(auth)/login");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/organizations`, {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
        },
      });
      setOrganizations(response.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch organizations"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission for Organization
  const handleSubmit = async () => {
    if (!organizationName.trim()) {
      setError("Organization name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/organizations`,
        { organizationName },
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", "Organization added successfully!");
      fetchOrganizations();
      toggleModal();
      setModal(false);
      setOrganizationName("");
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to add Organization, Please try again later"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const toggleModal = () => {
    if (modal) {
      setModal(false);
      Animated.spring(scaleValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      setModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };
  const renderOrganizationItem = ({ item }: { item: Organization }) => (
    <TouchableOpacity
      onPress={() => setSelectedOrg(item)}
      className="flex-row items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <View className="h-14 w-14 rounded-full bg-blue-500 items-center justify-center mr-4">
        <Text className="text-white text-xl font-bold">
          {item.organizationName.charAt(0)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white">
          {item.organizationName.toUpperCase()}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {item.contacts.length} members
        </Text>
      </View>
      <Text className="text-gray-400 font-bold text-2xl pr-6">›</Text>
    </TouchableOpacity>
  );

  const renderContactItem = ({ item }: { item: Contact }) => {
    const openWhatsApp = (phoneNumber: string) => {
      // Bersihkan nomor telepon dari karakter non-numerik
      const cleanNumber = phoneNumber.replace(/\D/g, "");

      // Cek apakah nomor dimulai dengan '0', jika ya, ganti dengan '62'
      const waNumber = cleanNumber.startsWith("0")
        ? `62${cleanNumber.slice(1)}`
        : cleanNumber;

      const url = `https://wa.me/${waNumber}`;
      Linking.openURL(url).catch((err) => {
        console.error("Error opening WhatsApp:", err);
      });
    };

    const openEmail = (email: string) => {
      const url = `mailto:${email}`;
      Linking.openURL(url).catch((err) => {
        console.error("Error opening email:", err);
      });
    };

    return (
      <TouchableOpacity className="flex-row items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <View className="h-14 w-14 rounded-full bg-gray-300 dark:bg-gray-600 items-center justify-center mr-4">
          <Text className="text-gray-600 dark:text-gray-300 text-xl font-semibold">
            {item.fullName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase())
              .slice(0, 2)
              .join("")}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.fullName.toUpperCase()}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {item.contactType}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => openEmail(item.email)}
            className="bg-blue-500 p-3 rounded-full"
          >
            <Feather name="mail" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openWhatsApp(item.phone)}
            className="bg-green-500 p-3 rounded-full"
          >
            <Feather name="message-circle" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600 dark:text-gray-400">
          Loading ...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={fetchOrganizations}
          className="bg-blue-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (selectedOrg) {
    return (
      <View className="flex-1 bg-gray-100 dark:bg-gray-900">
        <View className="bg-white dark:bg-gray-800 p-4 flex-row items-center border-b border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={() => setSelectedOrg(null)}
            className="mr-4"
          >
            <Text className="text-blue-500 font-semibold text-lg">‹ Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl pl-4 py-2 font-bold text-gray-900 dark:text-white">
            {selectedOrg.organizationName}
          </Text>
          <TouchableOpacity onPress={toggleDeleteModal} className="ml-auto">
            <Text className="text-red-500 font-semibold text-lg">Delete</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          className="mt-3"
          data={selectedOrg.contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text className="text-center py-8 text-gray-500 dark:text-gray-400">
              No contacts found in this organization
            </Text>
          }
        />

        {/* Floating action button for adding contacts */}
        <TouchableOpacity
          onPress={toggleContactAssignmentModal}
          className="absolute bottom-6 right-6"
        >
          <Animated.View className="w-16 h-16 bg-blue-500 border border-gray-300 dark:border-gray-600 rounded-full items-center justify-center shadow-lg">
            <Feather name="user-plus" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>

        {/* Contact Assignment Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={contactAssignmentModal}
          onRequestClose={toggleContactAssignmentModal}
        >
          <View className="flex-1 px-2 justify-center bg-black/50">
            <View className="bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-3xl p-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-black dark:text-white">
                  Add Member to Organization
                </Text>
                <TouchableOpacity
                  onPress={toggleContactAssignmentModal}
                  className="p-2"
                >
                  <Feather name="x" size={24} color="gray" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Picker
                  selectedValue={contactAssignment.contactId}
                  onValueChange={(itemValue) =>
                    setContactAssignment({
                      ...contactAssignment,
                      contactId: itemValue,
                    })
                  }
                  style={{ backgroundColor: "#f3f4f6" }}
                >
                  <Picker.Item label="Select Contact" value={0} />
                  {availableContacts.map((contact) => (
                    <Picker.Item
                      key={contact.id}
                      label={contact.fullName}
                      value={contact.id}
                    />
                  ))}
                </Picker>

                <TextInput
                  className="mt-4 border border-gray-300 dark:border-gray-600 p-4 rounded-xl mb-4 text-gray-900 dark:text-white"
                  value={contactAssignment.kelas}
                  onChangeText={(text) =>
                    setContactAssignment({
                      ...contactAssignment,
                      kelas: text,
                    })
                  }
                  placeholder="Class"
                  placeholderTextColor="#9CA3AF"
                />

                <Picker
                  selectedValue={contactAssignment.jabatan}
                  onValueChange={(itemValue) =>
                    setContactAssignment({
                      ...contactAssignment,
                      jabatan: itemValue,
                    })
                  }
                  style={{ backgroundColor: "#f3f4f6" }}
                >
                  <Picker.Item label="KETUA" value="KETUA" />
                  <Picker.Item label="WAKIL_KETUA" value="WAKIL_KETUA" />
                  <Picker.Item label="BENDAHARA" value="BENDAHARA" />
                  <Picker.Item label="PJ_MATKUL" value="PJ_MATKUL" />
                </Picker>

                <TextInput
                  className="border border-gray-300 dark:border-gray-600 p-4 rounded-xl my-4 text-gray-900 dark:text-white"
                  value={contactAssignment.periodeJabatan}
                  onChangeText={(text) =>
                    setContactAssignment({
                      ...contactAssignment,
                      periodeJabatan: text,
                    })
                  }
                  placeholder="Position Period"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={toggleContactAssignmentModal}
                  className="flex-1 bg-gray-200 p-3 rounded-xl"
                >
                  <Text className="text-center text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleContactAssignment}
                  className="flex-1 bg-blue-500 p-3 rounded-xl"
                >
                  <Text className="text-center text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Organization Modal */}
        <Modal
          visible={showDeleteModal}
          animationType="fade"
          transparent={true}
        >
          <View className="flex-1 justify-center bg-black/50 px-4">
            <View className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3">
              <View className="p-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delete Organization
                </Text>
              </View>

              <View className="p-4 mt-4">
                <Text className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to delete this organization?
                </Text>
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
                    onPress={handleDelete}
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
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
        <Text className="text-2xl py-2 font-bold text-center text-gray-900 dark:text-white">
          Groups
        </Text>
      </View>
      <FlatList
        className="mt-3"
        data={organizations}
        renderItem={renderOrganizationItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text className="text-center py-8 text-gray-500 dark:text-gray-400">
            No organizations found
          </Text>
        }
      />

      {/* Floating action button */}
      <TouchableOpacity
        onPress={toggleModal}
        className="absolute bottom-6 right-6"
      >
        <Animated.View
          className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center shadow-lg"
          style={{
            transform: [
              {
                scale: scaleValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.9],
                }),
              },
            ],
          }}
        >
          <Feather name="plus" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>

      {/* Add Organization Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={toggleModal}
      >
        <View className="flex-1 px-2 justify-center bg-black/50">
          <Animated.View
            className="bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-3xl p-6"
            style={{
              transform: [
                {
                  translateY: scaleValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                },
              ],
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-black dark:text-white">
                Add Organization
              </Text>
              <TouchableOpacity onPress={toggleModal} className="p-2">
                <Feather name="x" size={24} color="gray" />
              </TouchableOpacity>
            </View>

            {/* Modal content here */}
            <View className="mb-4">
              <TextInput
                className="border text-lg border-gray-300 dark:border-gray-600 p-3 rounded-xl mb-4 text-gray-900 dark:text-white"
                value={organizationName}
                onChangeText={setOrganizationName}
                placeholder="Organization Name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {/* Action buttons */}
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={toggleModal}
                className="flex-1 bg-gray-200 p-3 rounded-xl"
              >
                <Text className="text-center text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleSubmit();
                }}
                className="flex-1 bg-blue-500 p-3 rounded-xl"
              >
                <Text className="text-center text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default Groups;