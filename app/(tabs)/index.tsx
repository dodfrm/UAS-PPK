import React, { useState, useRef ,useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Linking,
  useColorScheme,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { useAuth, API_URL } from "@/Auth/authContext";

interface Contact {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  contactType: string;
  contactOrganizations: {
    id: number;
    kelas: string;
    jabatan: string;
    periodeJabatan: string;
  }[];
  contactSubject: {
    id: number;
    subject: {
      id: number;
      subjectName: string;
    }[];
  }[];
}

const ContactApp = () => {
  const { authState } = useAuth();
  const colorScheme = useColorScheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const[fullName, setFullName] = useState("");
  const[phone, setPhone] = useState("");
  const[email, setEmail] = useState("");
  const[contactType, setContactType] = useState("");


  // Unique filter options
  const [uniqueJabatan, setUniqueJabatan] = useState<string[]>([]);
  const [uniqueContactTypes, setUniqueContactTypes] = useState<string[]>([]);

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

  const [filterCriteria, setFilterCriteria] = useState({
    jabatan: "",
    contactType: "",
  });
  useEffect(() => {
    fetchContacts();
  }, [authState]);
  
  const fetchContacts = async () => {
    if (!authState?.accessToken) {
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/contacts`, {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
        },
      });
      const contactData = response.data || []; // Add fallback empty array
      setContacts(contactData);
      setFilteredContacts(contactData);

      // Extract unique subjects, jabatan, and contact types
      const subjects = new Set<string>();
      const jabatan = new Set<string>();
      const contactTypes = new Set<string>();

      contactData.forEach((contact: Contact) => {
        // Add null checks
        contact.contactSubject?.forEach((cs) => {
          cs.subject?.forEach((s) => subjects.add(s.subjectName));
        });
        contact.contactOrganizations?.forEach((org) =>
          jabatan.add(org.jabatan)
        );
        if (contact.contactType) {
          contactTypes.add(contact.contactType);
        }
      });

      setUniqueJabatan(Array.from(jabatan));
      setUniqueContactTypes(Array.from(contactTypes));
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    applyFilters(text);
  };

  // Handle Add Contact
  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/contacts`,
        {
          fullName,
          phone,
          email,
          contactType,
        },
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        fetchContacts();
        Alert.alert("Success", "Contact added successfully!");
        toggleModal();
        // Clear form fields
        setFullName("");
        setPhone("");
        setEmail("");
        setContactType("DOSEN");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add contact. Please try again later.");
    }
  };

  const applyFilters = (searchText: string = searchTerm) => {
    let result = contacts;

    if (searchText) {
      result = result.filter(
        (contact) =>
          contact.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          contact.phone.includes(searchText)
      );
    }

    if (filterCriteria.jabatan) {
      result = result.filter((contact) =>
        contact.contactOrganizations.some(
          (org) => org.jabatan === filterCriteria.jabatan
        )
      );
    }

    if (filterCriteria.contactType) {
      result = result.filter(
        (contact) => contact.contactType === filterCriteria.contactType
      );
    }

    setFilteredContacts(result);
  };

  useEffect(() => {
    applyFilters();
  }, [filterCriteria.jabatan, filterCriteria.contactType]);

  const resetFilters = () => {
    setFilterCriteria({
      jabatan: "",
      contactType: "",
    });
    setFilteredContacts(contacts);
    setSearchTerm("");
  };

  const renderFilterDropdown = (
    title: string,
    options: string[],
    currentValue: string,
    onSelect: (value: string) => void
  ) => (
    <View className="mb-4">
      <Text className="text-black dark:text-white mb-2">{title}:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option === currentValue ? "" : option)}
            className={`p-2 m-1 rounded ${
              currentValue === option
                ? "bg-blue-500"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`text-center ${
                currentValue === option
                  ? "text-white"
                  : "text-black dark:text-white"
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderContactItem = ({ item }: { item: Contact }) => {
    const openWhatsApp = (phoneNumber: string) => {
      // Clean the phone number from non-numeric characters
      const cleanNumber = phoneNumber.replace(/\D/g, "");

      // Check if number starts with '0', if yes, replace with '62'
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
      <TouchableOpacity
        className="flex-row items-center p-4 border border-gray-200 rounded-3xl bg-white shadow-md dark:bg-gray-800 dark:border-gray-700 mb-3"
        onPress={() => {
          setSelectedContact(item);
          setModalVisible(true);
        }}
      >
        <View className="w-14 h-14 bg-blue-200 rounded-full items-center justify-center mr-4">
          <Text className="text-2xl font-bold text-blue-800">
            {item.fullName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase())
              .slice(0, 2)
              .join("")}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-black dark:text-white">
            {item.fullName.toUpperCase()}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-300">
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

  return (
    <View className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
      <View className="flex-row items-center rounded-3xl mb-4 px-3 py-3">
        <TextInput
          className="flex-1 text-black text-lg pl-4 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl"
          placeholder="Search contacts..."
          placeholderTextColor={colorScheme === "dark" ? "#888" : "#000000"}
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <Feather
          name="search"
          size={24}
          color={colorScheme === "dark" ? "#888" : "#666"}
          className="mx-4 ml-6"
        />
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          className="ml-2"
        >
          <Feather
            name="filter"
            size={24}
            color={colorScheme === "dark" ? "#888" : "#666"}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text className="text-center pt-56 text-xl font-semibold text-gray-500 dark:text-gray-400">
            Opps!! No contacts found
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

      {/* Add Contact Form */}
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
                Add Contact
              </Text>
              <TouchableOpacity onPress={toggleModal} className="p-2">
                <Feather name="x" size={24} color="gray" />
              </TouchableOpacity>
            </View>

            {/* Modal content here */}
            <View className="mb-4">
              <TextInput
                className="border text-lg border-gray-300 dark:border-gray-600 p-3 rounded-xl mb-4 text-gray-900 dark:text-white"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                className="border text-lg border-gray-300 dark:border-gray-600 p-3 rounded-xl mb-4 text-gray-900 dark:text-white"
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
              <TextInput
                className="border text-lg border-gray-300 dark:border-gray-600 p-3 rounded-xl mb-4 text-gray-900 dark:text-white"
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
              />
              <View className="border text-lg border-gray-300 dark:border-gray-600 p-3 rounded-xl mb-4">
                <Text className="text-gray-900 dark:text-white">
                  Contact Type:
                </Text>
                <View className="flex-row justify-around mt-2">
                  <TouchableOpacity
                    onPress={() => setContactType("DOSEN")}
                    className={`p-2 rounded-lg ${
                      contactType === "DOSEN" ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        contactType === "DOSEN" ? "text-white" : "text-gray-700"
                      }
                    >
                      DOSEN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setContactType("MAHASISWA")}
                    className={`p-2 rounded-lg ${
                      contactType === "MAHASISWA"
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        contactType === "MAHASISWA"
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      MAHASISWA
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setContactType("STAFF")}
                    className={`p-2 rounded-lg ${
                      contactType === "STAFF" ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        contactType === "STAFF" ? "text-white" : "text-gray-700"
                      }
                    >
                      STAFF
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
                  handleSave();
                }}
                className="flex-1 bg-blue-500 p-3 rounded-xl"
              >
                <Text className="text-center text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Contact Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-3xl p-6 h-1/2">
            <TouchableOpacity
              className="absolute top-4 right-4 z-10"
              onPress={() => setModalVisible(false)}
            >
              <Feather
                name="x"
                size={28}
                color={colorScheme === "dark" ? "#888" : "#000000"}
                className="text-black dark:text-white"
              />
            </TouchableOpacity>

            {selectedContact && (
              <View className="mt-8">
                <View className="items-center mb-6">
                  <View className="w-24 h-24 bg-blue-200 rounded-full items-center justify-center">
                    <Text className="text-3xl font-bold text-blue-800">
                      {selectedContact.fullName
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .slice(0, 2)
                        .join("")}
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold mt-4 text-black dark:text-white">
                    {selectedContact.fullName.toUpperCase()}
                  </Text>
                  <Text className="text-lg text-gray-600 dark:text-gray-300">
                    {selectedContact.contactType}
                  </Text>
                </View>

                <View className="space-y-4 px-3">
                  <View className="flex-row items-center mb-3">
                    <Feather
                      name="phone"
                      size={24}
                      color={colorScheme === "dark" ? "#888" : "#000000"}
                      className="mr-4 text-gray-600 dark:text-gray-300"
                    />
                    <Text className="text-lg text-black dark:text-white">
                      {selectedContact.phone}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-3">
                    <Feather
                      name="mail"
                      size={24}
                      color={colorScheme === "dark" ? "#888" : "#000000"}
                      className="mr-4 text-gray-600 dark:text-gray-300"
                    />
                    <Text className="text-lg text-black dark:text-white">
                      {selectedContact.email}
                    </Text>
                  </View>

                  {selectedContact.contactOrganizations.map((org) => (
                    <View key={org.id} className="flex-row items-center mb-3">
                      <Feather
                        name="users"
                        size={24}
                        color={colorScheme === "dark" ? "#888" : "#000000"}
                        className="mr-4 text-gray-600 dark:text-gray-300"
                      />
                      <Text className="text-lg text-black dark:text-white">
                        {org.kelas} - {org.jabatan} ({org.periodeJabatan})
                      </Text>
                    </View>
                  ))}

                  {selectedContact.contactSubject?.map((cs) => (
                    <View key={cs.id} className="flex-row items-center mb-3">
                      <Feather
                        name="book"
                        size={24}
                        color={colorScheme === "dark" ? "#888" : "#000000"}
                        className="mr-4 text-gray-600 dark:text-gray-300"
                      />
                      <Text className="text-lg text-black dark:text-white">
                        {cs.subject?.map((s) => s.subjectName).join(", ") ||
                          "No subjects"}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => {
          setFilterModalVisible(false);
          applyFilters();
        }}
      >
        <View className="flex-1 justify-end">
          <View className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-3xl p-6 h-1/2 pt-12 px-8">
            <TouchableOpacity
              className="absolute top-4 right-4 z-10"
              onPress={() => setFilterModalVisible(false)}
            >
              <Feather
                name="x"
                size={28}
                color={colorScheme === "dark" ? "#888" : "#000000"}
                className="text-black dark:text-white"
              />
            </TouchableOpacity>

            <Text className="text-2xl font-bold mb-4 text-black dark:text-white">
              Filter Contacts
            </Text>

            {renderFilterDropdown(
              "Jabatan",
              uniqueJabatan,
              filterCriteria.jabatan,
              (value) => {
                setFilterCriteria((prev) => ({ ...prev, jabatan: value }));
                applyFilters();
              }
            )}

            {renderFilterDropdown(
              "Contact Type",
              uniqueContactTypes,
              filterCriteria.contactType,
              (value) => {
                setFilterCriteria((prev) => ({ ...prev, contactType: value }));
                applyFilters();
              }
            )}

            <TouchableOpacity
              onPress={resetFilters}
              className="bg-red-500 rounded-2xl p-3 mt-4"
            >
              <Text className="text-white text-center">Reset Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ContactApp;